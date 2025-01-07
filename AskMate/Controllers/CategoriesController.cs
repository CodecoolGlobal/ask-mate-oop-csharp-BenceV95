using AskMate.Models;
using AskMate.Models.Repos;
using Microsoft.AspNetCore.Mvc;

namespace AskMate.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoriesRepo _database;
        public CategoriesController(ICategoriesRepo database)
        {
            _database = database;
        }

        [HttpPost()]
        public IActionResult CreateCategory([FromBody] Category request)
        {
            var result = _database.CreateCategory(request.Name);
            if (result)
            {
                return Ok();
            }

            return BadRequest(); // is it though ?
        }

        [HttpGet()]
        public IActionResult GetAllCategories()
        {
            var result = _database.GetAllCategories();
            if (result.Count > 0)
            {
                return Ok(result);
            }

            return BadRequest(); // is it though ?
        }
    }
}
