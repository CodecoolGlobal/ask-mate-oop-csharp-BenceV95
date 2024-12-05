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


        //this sendsa  post request to the server, to make a new user in the database, and from the request body it extracts the required data
        [HttpPost()]
        public IActionResult CreateUser([FromBody] UserRequest request)
        {
            return Ok(_database.CreateUser(request.Username, request.Email, request.Password));
        }

        //[HttpPost("Login")]
        //public IActionResult Login()
        //{

        //}

        //[HttpPost("/logout")]
        //public IActionResult Logout()
        //{

        //}

        [HttpGet("/{id}/Points")]
        public IActionResult PointSystem(string id)
        {
            if (_database.ValidUser(id))
            {
               return Ok(_database.CalculateUserPoints(id));
            }
            return NotFound("This user does not exist.");
        }
    }
}
