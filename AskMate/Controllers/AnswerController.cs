using AskMate.Models;
using AskMate.Models.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AskMate.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AnswerController : ControllerBase
    {
        private readonly IAskMateDatabase _database;
        public AnswerController(IAskMateDatabase database)
        {
            _database = database;
        }

        [HttpGet("{id}")]
        public IActionResult GetAnswers(string id)
        {
            return Ok(_database.GetAnswer(id));

        }

        [Authorize]
        [HttpPost()]
        public IActionResult CreateAnswer(Answer answer)
        {
            var loggedInUserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return Ok(_database.CreateNewAnswer(answer, loggedInUserID));
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAnswer(string id)
        {
            _database.DeleteAnswer(id);
            return Ok();
        }

        [HttpPatch("{id}")]
        public IActionResult UpdateAnswer(Answer answer)
        {
            _database.UpdateAnswer(answer);
            return Ok();
        }

        [Authorize]
        [HttpPatch("Accept/{id}")]
        public IActionResult AcceptAnswer(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (_database.IsAnswerBelongToLoggedInUsersQuestion(userId, id))
            {
                _database.AcceptAnswer(id);
                return Ok();
            }

            return Unauthorized();
        }
    }
}
