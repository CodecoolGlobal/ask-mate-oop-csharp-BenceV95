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
        return Ok(_database.GetAllQuestions());
    }


    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuestion(string id)
    {
        var question = await _database.GetQuestion(id);
        return Ok(question);
    }

    
    [HttpPost()]
    public IActionResult CreateQuestion([FromBody] Question question)
    {
        var loggedInUserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine(loggedInUserID);

        //returns the id
        return Ok(_database.CreateNewQuestion(question, loggedInUserID));
    }

    
    [HttpDelete("{id}")]
    public IActionResult DeleteQuestion(string id)
    {
        _database.DeleteQuestion(id);
        return Ok();
    }

    
    [HttpGet("search")]
    public IActionResult Search([FromQuery] string query)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query cannot be empty.");
            }

            string formattedQuery = string.Join(" & ", query.Split(' ', StringSplitOptions.RemoveEmptyEntries));

            var searched = _database.Search(formattedQuery);

            if (searched == null)
            {
                return NotFound(searched);
            }

            return Ok(searched);
        }
        catch (Exception e)
        {
            return StatusCode(500, new { Message = "Internal Server Error", details = e.Message });
        }
        
    }
}