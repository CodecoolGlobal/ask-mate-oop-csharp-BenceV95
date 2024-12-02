using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using AskMate.Models.Repos;
using Npgsql;

namespace AskMate.Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionController : ControllerBase
{
    private readonly IAskMateDatabase _database;
    private readonly string _connectionString;

    public QuestionController(IAskMateDatabase database)
    {
        _database = database;
    }


    [HttpGet("all")]
    public IActionResult GetAllQuestion()
    {
        return Ok(_database.GetAllQuestions());
    }

    [HttpGet("{id}")]
    public IActionResult GetQuestion(string id)
    {
        return Ok(_database.GetQuestion(id));
    }

    [HttpPost()]
    public IActionResult CreateQuestion(Question question)
    {
        return Ok(_database.CreateNewQuestion(question));
    }

    [HttpPut("{id}")]
    public IActionResult UpdateQuestion(Question question)
    {
        return Ok(_database.UpdateAnswer(question);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteQuestion(string id)
    {
        return Ok(_database.DeleteQuestion(id));
    }



    //    Create an endpoint to retrieve all the questions.

    //An endpoint called /Question exists.

    //The endpoint uses the GET request method.

    //The data is sorted by starting with the most recent one.












}