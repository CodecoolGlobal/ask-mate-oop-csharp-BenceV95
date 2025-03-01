using AskMate.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using AskMate.Repos.Users;
using AskMate.Models.Users;

namespace AskMate.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepo _database;
        public UserController(IUserRepo database)
        {
            _database = database;
        }



        [HttpPut("update/{id}")]
        public IActionResult UpdateUser([FromBody] UserUpdateRequest userUpdate, string id)
        {
            try
            {
                _database.UpdateUser(id, userUpdate);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult GetUserByNameOrEmail(string nameOrEmail)
        {
            try
            {
                var user = _database.GetUserByNameOrEmail(nameOrEmail);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        /// <summary>
        /// Sends a post request to the server, to make a new user in the database, and from the request body it extracts the required data
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost()]
        public IActionResult CreateUser([FromBody] UserRequest request)
        {
            var result = _database.CreateUser(request.Username, request.Email, request.Password);

            return Ok();
        }

        [HttpGet("allUsers")]
        public IActionResult GetUsers()
        {
            return Ok(_database.GetAllUsers());
        }


        [HttpGet("paginate/")]
        public IActionResult GetUsersPaginated([Required] int pageNumber, [Required] int limit)
        {
            try
            {
                var data = _database.GetUsersPaginated(pageNumber, limit);

                //List<User> users = data.users;
                //int usersCount = users.Count;

                return Ok(new { data.totalCount, data.users });
            }
            catch (Exception e) { return BadRequest(e.Message); };
        }




        //session check
        [HttpGet("session")]
        [Authorize] // Requires the user to be authenticated
        public IActionResult ValidateSession()
        {
            var username = User.Identity.Name; // Get the logged-in user's name
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            return Ok(new { IsLoggedIn = true, Username = username, Id = userId, Role = role });
        }


        [Authorize]
        [HttpGet("/{id}/Points")]
        public IActionResult PointSystem(string id)
        {
            if (_database.ValidUser(id))
            {
                return Ok(_database.CalculateUserPoints(id));
            }
            return NotFound("This user does not exist.");
        }

        [Authorize]
        [HttpDelete("/users/{id}")]
        public IActionResult DeleteUser(string id)
        {
            _database.DeleteUser(id);
            return Ok();
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest user)
        {
            // Validate credentials (replace with actual validation)
            if (_database.AuthUser(user.Username, user.Password, out User userFromDb))
            {
                Console.WriteLine("login");
                // Create user claims
                var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, userFromDb.Role),
                new Claim(ClaimTypes.NameIdentifier, userFromDb.Id)
            };

                // Create identity and principal
                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);

                // Sign in the user
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
                {
                    IsPersistent = true, // Keep the cookie even after closing the browser
                    ExpiresUtc = DateTime.UtcNow.AddMinutes(30)
                });

                return Ok(new { Message = "Login successful" });
            }

            return Unauthorized(new { Message = "Invalid username or password" });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { Message = "Logged out" });
        }
    }
}
