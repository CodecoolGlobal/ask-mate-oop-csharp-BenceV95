using AskMate.Models.Categories;
using AskMate.Repos.Categories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AskMate.Controllers
{
    [Authorize]
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
            try
            {
                var result = _database.CreateCategory(request.Name);
                if (result)
                {
                    return Ok(new { message = "Category created successfully!" });
                }

                return BadRequest(new { message = "Couldn't create category!" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet()]
        public IActionResult GetAllCategories()
        {
            try
            {
                var result = _database.GetAllCategories();
                if (result.Count > 0)
                {
                    return Ok(result);
                }

                return Ok(new List<string>()); //send an empty list back to avoid errors

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete()]
        public IActionResult DeleteCategory(int id)
        {

            try
            {
                var result = _database.DeleteCategory(id);
                if (result)
                {
                    return Ok(new { message = "Category deleted successfully!" });
                }

                return BadRequest(new { message = "Couldn't delete category!" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch()]
        public IActionResult UpdateCategory(int id, string name)
        {
            try
            {
                var result = _database.UpdateCategory(id, name);
                if (result)
                {
                    return Ok(new { message = "Category updated successfully!" });
                }
                return BadRequest(new { message = "Couldn't update category!" });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
