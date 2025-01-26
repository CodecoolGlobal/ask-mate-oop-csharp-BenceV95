using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using Npgsql;
using AskMate.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using AskMate.Repos;

namespace AskMate.Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionController : ControllerBase
{
    private readonly IQuestionsRepo _database;


    public QuestionController(IQuestionsRepo database)
    {
        _database = database;
    }

    [Authorize]
    [HttpGet()]
    public IActionResult GetAllQuestion()
    {
        return Ok(_database.GetAllQuestions());
    }


    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuestion(string id)
    {
        var question = await _database.GetQuestion(id);
        return Ok(question);
    }

    [Authorize]
    [HttpPost()]
    public IActionResult CreateQuestion([FromBody] Question question)
    {
        var loggedInUserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine(loggedInUserID);

        //returns the id
        return Ok(_database.CreateNewQuestion(question, loggedInUserID));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult DeleteQuestion(string id)
    {
        _database.DeleteQuestion(id);
        return Ok();
    }

    [Authorize]
    [HttpGet("search")]
    public IActionResult Search([FromQuery] string query)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query cannot be empty.");
            }

            var searched = _database.Search(query);
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