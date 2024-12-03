using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Net;
using AskMate.Models.Repos;

namespace AskMate.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : Controller
    {
        IAskMateDatabase _database;
        public AuthController(IAskMateDatabase database)
        {
            _database = database;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            // Validate credentials (replace with actual validation)
            if (username == "testuser" && password == "password123")
            {
                // Create user claims
                var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, "User")
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
