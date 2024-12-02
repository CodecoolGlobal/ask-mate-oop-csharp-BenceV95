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


    [HttpGet]
    public IActionResult GetAllQuestion()
    {
        var repository = new AskMateDatabase(new NpgsqlConnection(_connectionString);
        return Ok(repository.GetAllQuestion());
    }

    [HttpGet("id")]
    public IActionResult GetQuestion(string id)
    {
        var repository = new AskMateDatabase(new NpgsqlConnection(_connectionString));
        return Ok(repository.GetQuestion(id));
    }

    [HttpPost()]
    public IActionResult CreateQuestion(Question question)
    {
        var repository = new AskMateDatabase(new NpgsqlConnection(_connectionString));
        return Ok(repository.CreateNewQuestion(question));
    }

    [HttpPost]
    public IActionResult GetAnswers(string id)
    {
        var repository = new AskMateDatabase(new NpgsqlConnection(_connectionString));
        return Ok(repository.GetAnswer(id));
        
    }







    //    Create an endpoint to retrieve all the questions.

    //An endpoint called /Question exists.

    //The endpoint uses the GET request method.

    //The data is sorted by starting with the most recent one.












}