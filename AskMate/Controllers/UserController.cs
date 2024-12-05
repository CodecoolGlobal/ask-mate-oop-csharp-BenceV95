using AskMate.Models;
using AskMate.Models.Repos;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

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


        /// <summary>
        /// Sends a post request to the server, to make a new user in the database, and from the request body it extracts the required data
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost()]
        public IActionResult CreateUser([FromBody] UserRequest request)
        {
            return Ok(_database.CreateUser(request.Username, request.Email, request.Password));
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


        [HttpPost("login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            // Validate credentials (replace with actual validation)
            if (_database.AuthUser(username, password, out string userID))
            {
                Console.WriteLine("login");
                // Create user claims
                var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, "User"), //to be implemented
                new Claim(ClaimTypes.NameIdentifier, userID)
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
