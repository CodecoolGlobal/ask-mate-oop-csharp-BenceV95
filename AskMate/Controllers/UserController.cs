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
    }
}
