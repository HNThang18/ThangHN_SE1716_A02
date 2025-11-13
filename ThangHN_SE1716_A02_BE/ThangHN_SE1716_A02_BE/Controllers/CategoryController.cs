using BO.DTO;
using BO.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Service;

namespace ThangHN_SE1716_A02_BE.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("odata")]
        [EnableQuery]
        [AllowAnonymous]
        public IActionResult GetOData()
        {
            var categories = _categoryService.GetAllCategories().AsQueryable();
            return Ok(categories);
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAllCategories()
        {
            var categories = _categoryService.GetAllCategories();
            return Ok(new ApiResponse("Categories retrieved successfully.", "200", categories));
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetCategoryById(int id)
        {
            var category = _categoryService.GetCategoryById(id);
            if (category == null)
                return NotFound(new ApiResponse("Category not found.", "404"));
            return Ok(new ApiResponse("Category retrieved successfully.", "200", category));
        }

        [HttpPost]
        [Authorize(Roles = "1")]
        public IActionResult CreateCategory([FromBody] CreateCategoryRequest request)
        {
            try
            {
                var category = new Category
                {
                    CategoryName = request.CategoryName,
                    CategoryDescription = request.CategoryDescription,
                    ParentCategoryId = request.ParentCategoryId,
                    IsActive = request.IsActive
                };
                
                _categoryService.AddCategory(category);
                return CreatedAtAction(nameof(GetCategoryById), new { id = category.CategoryId }, new ApiResponse("Category created successfully.", "201", category));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse(ex.Message, "400"));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "1")]
        public IActionResult UpdateCategory(int id, [FromBody] UpdateCategoryRequest request)
        {
            if (id != request.CategoryId)
                return BadRequest(new ApiResponse("ID mismatch.", "400"));

            var existing = _categoryService.GetCategoryById(id);
            if (existing == null)
                return NotFound(new ApiResponse("Category not found.", "404"));

            try
            {
                existing.CategoryName = request.CategoryName;
                existing.CategoryDescription = request.CategoryDescription;
                existing.ParentCategoryId = request.ParentCategoryId;
                existing.IsActive = request.IsActive;
                
                _categoryService.UpdateCategory(existing);
                return Ok(new ApiResponse("Category updated successfully.", "200", existing));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse(ex.Message, "400"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "1")]
        public IActionResult DeleteCategory(int id)
        {
            var existing = _categoryService.GetCategoryById(id);
            if (existing == null)
                return NotFound(new ApiResponse("Category not found.", "404"));

            try
            {
                _categoryService.DeleteCategory(id);
                return Ok(new ApiResponse("Category deleted successfully.", "200"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse(ex.Message, "400"));
            }
        }

        [HttpGet("search")]
        [Authorize(Roles = "1")]
        public IActionResult SearchCategories([FromQuery] string? name)
        {
            var categories = _categoryService.SearchCategories(name);
            return Ok(new ApiResponse("Categories searched successfully.", "200", categories));
        }
    }
}
