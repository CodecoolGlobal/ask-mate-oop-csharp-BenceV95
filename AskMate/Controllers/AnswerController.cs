using AskMate.Models.Answers;
using AskMate.Repos.Answers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AskMate.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AnswerController : ControllerBase
    {
        private readonly IAnswersRepo _database;
        public AnswerController(IAnswersRepo database)
        {
            _database = database;
        }

        
        [HttpGet("{id}")]
        public IActionResult GetAnswers(string id)
        {
            try
            {
                return Ok(new { message = _database.GetAnswer(id) });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpDelete("all/{id}")]
        public IActionResult DeleteAnswerByQuestionId(string id)
        {
            try
            {
                _database.DeleteAnswerByQuestionId(id);
                return Ok(new { message = "Answer deleted successfully!" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpGet("all/{id}")]
        public IActionResult GetAllAnswersByQuestionId(string id)
        {
            try
            {
                var answers = _database.GetAllAnswersByQuestionId(id);
                if (answers == null)
                {
                    return Ok(Array.Empty<int>()); //why isnt answers an empty array by default?
                }
                return Ok(answers);

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpGet("all/byUserId/{userId}")]
        public IActionResult GetAllAnswersByUserId(string userId)
        {
            try
            {
                var answers = _database.GetAllAnswersByUserId(userId);
                return Ok(answers);

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpPost()]
        public IActionResult CreateAnswer(Answer answer)
        {
            try
            {
                // user may create an answer if a question is not closed by having an accepted answer or if there are no answers yet.
                var answers = _database.GetAllAnswersByQuestionId(answer.QuestionID);

                if (answers != null && answers.Any(a => a.IsAccepted))
                {
                    return BadRequest(new { message = "You can not post an answer to a closed question." }); // this logic shouldnt be here!
                }

                var loggedInUserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                return Ok(new {Message = _database.CreateNewAnswer(answer, loggedInUserID)});

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpDelete("{id}")]
        public IActionResult DeleteAnswer(string id)
        {
            try
            {
                _database.DeleteAnswer(id);
                return Ok(new { message = "Answer deleted successfully!" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpPatch("{id}")]
        public IActionResult UpdateAnswer(Answer answer)
        {
            try
            {
                _database.UpdateAnswer(answer);
                return Ok(new { message = "Answer updated successfully!" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
        [HttpPost("Accept/{id}")]
        public IActionResult AcceptAnswer(string id)
        {

            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (_database.IsAnswerBelongToLoggedInUsersQuestion(userId, id))
                {
                    _database.AcceptAnswer(id);
                    return Ok(new { message = "Answer accepted!" });
                }

                return BadRequest(new { message = "You cannot accept an answer for another users question!" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
