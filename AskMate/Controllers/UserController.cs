using Microsoft.AspNetCore.Mvc;

namespace AskMate.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        [HttpPost()]
        public IActionResult CreateUser(User user)
        {
            return Ok(_database.CreateUser(user));
        }
    }
}
