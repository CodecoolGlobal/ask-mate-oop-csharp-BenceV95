using AskMate.Models;
using AskMate.Models.Repos;
using Microsoft.AspNetCore.Mvc;

namespace AskMate.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IAskMateDatabase _database;
        public UserController(IAskMateDatabase database)
        {
            _database = database;
        }

        [HttpPost()]
        public IActionResult CreateUser(User user)
        {
            return Ok(_database.CreateUser(user));
        }

        //[HttpPost("Login")]
        //public IActionResult Login()
        //{

        //}

        //[HttpPost("/logout")]
        //public IActionResult Logout()
        //{

        //}

        //[HttpGet("/{id}/Points")]
        //public IActionResult PointSystem()
        //{

        //}
    }
}
