using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using AskMate.Models.Repos;

namespace AskMate.Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionController : ControllerBase
{
    private readonly IAskMateDatabase _database;

    public QuestionController(IAskMateDatabase database)
    {
        _database = database;
    }


    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok("No questions were asked yet.");
    }


    [HttpGet]
    public IActionResult GetSingleBook(int id)
    {

    }



    //    Create an endpoint to retrieve all the questions.

    //An endpoint called /Question exists.

    //The endpoint uses the GET request method.

    //The data is sorted by starting with the most recent one.












}