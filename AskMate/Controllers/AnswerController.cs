using Microsoft.AspNetCore.Mvc;

namespace AskMate.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AnswerController : ControllerBase
    {
        [HttpGet("{id}")]
        public IActionResult GetAnswers(string id)
        {
            return Ok(_database.GetAnswer(id));

        }

        [HttpPost()]
        public IActionResult CreateAnswer(Answer answer)
        {
            return Ok(_database.CreateNewAnswer(answer));
        }

        [HttpPut("{id}")]
        public IActionResult UpdateAnswer(Answer answer)
        {
            return Ok(_database.UpdateAnswer(answer);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAnswer(string id)
        {
            return Ok(_databaseDeleteAnswer(id));
        }
    }
}
