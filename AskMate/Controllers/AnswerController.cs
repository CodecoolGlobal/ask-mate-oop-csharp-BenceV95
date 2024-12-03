using AskMate.Models;
using AskMate.Models.Repos;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost()]
        public IActionResult CreateAnswer(Answer answer)
        {
            return Ok(_database.CreateNewAnswer(answer));
        }

        //[HttpPut("{id}")]
        //public IActionResult UpdateAnswer(Answer answer)
        //{
        //    return Ok(_database.UpdateAnswer(answer);
        //}

        [HttpDelete("{id}")]
        public IActionResult DeleteAnswer(string id)
        {
            return Ok(_database.DeleteAnswer(id));
        }
    }
}
