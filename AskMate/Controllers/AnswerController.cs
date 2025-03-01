using AskMate.Models.Answers;
using AskMate.Repos.Answers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AskMate.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AnswerController : ControllerBase
    {
        private readonly IAnswersRepo _database;
        public AnswerController(IAnswersRepo database)
        {
            _database = database;
        }

        [Authorize]
        [HttpGet("{id}")]
        public IActionResult GetAnswers(string id)
        {
            return Ok(_database.GetAnswer(id));

        }

        [Authorize]
        [HttpDelete("all/{id}")]
        public IActionResult DeleteAnswerByQuestionId(string id)
        {
            _database.DeleteAnswerByQuestionId(id);
            return Ok();
        }

        [Authorize]
        [HttpGet("all/{id}")]
        public IActionResult GetAllAnswersByQuestionId(string id)
        {
            var answers = _database.GetAllAnswersByQuestionId(id);
            if (answers == null)
            {
                return Ok(Array.Empty<int>());
            }
                return Ok(answers);
        }

        [Authorize]
        [HttpPost()]
        public IActionResult CreateAnswer(Answer answer)
        {
            // user may create an answer if a question is not closed by having an accepted answer or if there are no answers yet.
            var answers = _database.GetAllAnswersByQuestionId(answer.QuestionID);

            if (answers != null && answers.Any(a=>a.IsAccepted))
            {
                return BadRequest("You can not post an answer to a closed question.");
            }

            var loggedInUserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return Ok(_database.CreateNewAnswer(answer, loggedInUserID));
        }

        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult DeleteAnswer(string id)
        {
            _database.DeleteAnswer(id);
            return Ok();
        }

        [Authorize]
        [HttpPatch("{id}")]
        public IActionResult UpdateAnswer(Answer answer)
        {
            _database.UpdateAnswer(answer);
            return Ok();
        }

        [Authorize]
        [HttpPost("Accept/{id}")]
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
