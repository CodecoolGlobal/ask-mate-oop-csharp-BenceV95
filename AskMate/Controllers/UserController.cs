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
    [Authorize]
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
                return Ok(new { message = "User successfully updated!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetUserByNameOrEmail")]
        public IActionResult GetUserByNameOrEmail(string nameOrEmail)
        {
            try
            {
                var user = _database.GetUserByNameOrEmail(nameOrEmail);
                if (user == null)
                {
                    return NotFound(new {Message = "User not found !"});
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        /// <summary>
        /// Sends a post request to the server, to make a new user in the database, and from the request body it extracts the required data
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost()]
        public IActionResult CreateUser([FromBody] UserRequest request)
        {
            try
            {
                var result = _database.CreateUser(request.Username, request.Email, request.Password);

                return Ok(new {message = result });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpGet("allUsers")]
        public IActionResult GetUsers()
        {
            try
            {
                return Ok(_database.GetAllUsers());

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            };
        }

        [AllowAnonymous]
        [HttpGet("session")]
        public IActionResult ValidateSession()
        {
            try
            {
                var username = User.Identity.Name; // Get the logged-in user's name
                var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
                var email = User.Claims.FirstOrDefault(e => e.Type == ClaimTypes.Email)?.Value;
                if (userId != null)
                {
                    return Ok(new { IsLoggedIn = true, Username = username, Id = userId, Role = role, Email = email });
                }
                return Unauthorized(new { IsLoggedIn = false, Username = username, Id = userId, Role = role, Email = email});

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpGet("/{id}/Points")]
        public IActionResult PointSystem(string id)
        {
            try
            {
                if (_database.ValidUser(id)) // ?
                {
                    var points = _database.CalculateUserPoints(id);
                    return Ok(new { points });
                }
                return NotFound(new { message = "This user does not exist." });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpDelete("/users/{id}")]
        public IActionResult DeleteUser(string id)
        {
            try
            {
                var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (userId != id)
                {
                    return Unauthorized(new { Message = "You may only delete your own account !" });
                }

                _database.DeleteUser(id);

                return Ok(new { message = "User successfully deleted!" });

            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });

            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest user)
        {
            try
            {
                // Validate credentials (replace with actual validation)
                if (_database.AuthUser(user.Username, user.Password, out User userFromDb))
                {
                    // Create user claims
                    var claims = new List<Claim>
                     {
                        new Claim(ClaimTypes.Name, userFromDb.Username),
                        new Claim(ClaimTypes.Role, userFromDb.Role),
                        new Claim(ClaimTypes.NameIdentifier, userFromDb.Id),
                        new Claim(ClaimTypes.Email, userFromDb.Email)
                    };

                    // Create identity and principal
                    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    var principal = new ClaimsPrincipal(identity);

                    // Sign in the user
                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
                    {
                        IsPersistent = true, // Keep the cookie even after closing the browser
                        ExpiresUtc = DateTime.UtcNow.AddMinutes(60)
                    });

                    return Ok(new { Username = userFromDb.Username, Email = userFromDb.Email, Role = userFromDb.Role, Id = userFromDb.Id }); //should make dedicated class in future
                }

                return Unauthorized(new { message = "Invalid username or password" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Ok(new { Message = "User successfully logged out!" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
