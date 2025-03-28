using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using Npgsql;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using AskMate.Repos.Questions;
using AskMate.Models.Questions;

namespace AskMate.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class QuestionController : ControllerBase
{
    private readonly IQuestionsRepo _database;


    public QuestionController(IQuestionsRepo database)
    {
        _database = database;
    }

    [AllowAnonymous] // remove this after testing !
    [HttpGet("byCategoryWithLimit")]
    public IActionResult GetQuestions(int? categoryId, int limit = 10)
    {
        try
        {
            var questions = _database.GetQuestions(categoryId, limit);
            return Ok(questions);
        }
        catch (Exception e)
        {
            return BadRequest(new {Message = e.Message});
        }
    }

    
    [HttpGet()]
    public IActionResult GetAllQuestion()
    {
        try
        {
            return Ok(_database.GetAllQuestions());

        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }


    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuestion(string id)
    {
        try
        {
            var question = await _database.GetQuestion(id);
            return Ok(question);

        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    
    [HttpPost()]
    public IActionResult CreateQuestion([FromBody] Question question)
    {
        try
        {
            var loggedInUserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            //returns the id
            return Ok(new { message = _database.CreateNewQuestion(question, loggedInUserID) });

        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    
    [HttpDelete("{id}")]
    public IActionResult DeleteQuestion(string id)
    {
        try
        {
            _database.DeleteQuestion(id);
            return Ok(new { message = "Question deleted successfully!" });

        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    
    [HttpGet("search")]
    public IActionResult Search([FromQuery] string query)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { message = "Query cannot be empty." });
            }

            string formattedQuery = string.Join(" & ", query.Split(' ', StringSplitOptions.RemoveEmptyEntries));

            var searched = _database.Search(formattedQuery);

            if (searched == null)
            {
                return NotFound(new { message = "Couldnt find any question!" });
            }

            return Ok(searched);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }

    }
}