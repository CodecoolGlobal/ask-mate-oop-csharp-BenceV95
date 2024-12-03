using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using AskMate.Models.Repos;
using Npgsql;
using AskMate.Models;

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
    public IActionResult CreateQuestion(Question question)
    {
        //returns the id
        return Ok(_database.CreateNewQuestion(question));
    }

    //[HttpPut("{id}")]
    //public IActionResult UpdateQuestion(Question question)
    //{
    //    return Ok(_database.UpdateAnswer(question);
    //}

    [HttpDelete("{id}")]
    public IActionResult DeleteQuestion(string id)
    {
        _database.DeleteQuestion(id);
        return Ok();
    }



    //    Create an endpoint to retrieve all the questions.

    //An endpoint called /Question exists.

    //The endpoint uses the GET request method.

    //The data is sorted by starting with the most recent one.












}