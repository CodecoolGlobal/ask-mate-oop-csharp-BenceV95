using AskMate.Models.Categories;
using AskMate.Repos.Categories;
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

        [HttpDelete()]
        public IActionResult DeleteCategory(int id)
        {
            var result = _database.DeleteCategory(id);
            if (result)
            {
                return Ok();
            }

            return BadRequest(); // is it though ?
        }

        [HttpPatch()]
        public IActionResult UpdateCategory(int id, string name)
        {
            var result = _database.UpdateCategory(id,name);
            if (result)
            {
                return Ok();
            }

            return BadRequest(); // is it though ?
        }
    }
}
