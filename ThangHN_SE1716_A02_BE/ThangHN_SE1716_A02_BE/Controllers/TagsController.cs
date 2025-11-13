using BO.DTO;
using BO.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Service;

namespace ThangHN_SE1716_A02_BE.Controllers
{
    [ApiController]
    [Route("api/tags")]
    public class TagsController : ControllerBase
    {
        private readonly ITagService _tagService;
        public TagsController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet("odata")]
        [EnableQuery]
        [AllowAnonymous]
        public IActionResult GetOData()
        {
            var tags = _tagService.GetAllTags().AsQueryable();
            return Ok(tags);
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAllTags()
        {
            var tags = _tagService.GetAllTags();
            return Ok(new ApiResponse("Tags retrieved successfully.", "200", tags));
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetTagById(int id)
        {
            var tag = _tagService.GetTagById(id);
            if (tag == null)
                return NotFound(new ApiResponse("Tag not found.", "404"));
            return Ok(new ApiResponse("Tag retrieved successfully.", "200", tag));
        }

        [HttpPost]
        [Authorize(Roles = "1")]
        public IActionResult CreateTag([FromBody] CreateTagRequest request)
        {
            try
            {
                var tag = new Tag
                {
                    TagName = request.TagName,
                    Note = request.Note
                };
                
                _tagService.AddTag(tag);
                return CreatedAtAction(nameof(GetTagById), new { id = tag.TagId }, new ApiResponse("Tag created successfully.", "201", tag));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse(ex.Message, "400"));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "1")]
        public IActionResult UpdateTag(int id, [FromBody] UpdateTagRequest request)
        {
            if (id != request.TagId)
                return BadRequest(new ApiResponse("ID mismatch.", "400"));

            var existing = _tagService.GetTagById(id);
            if (existing == null)
                return NotFound(new ApiResponse("Tag not found.", "404"));

            try
            {
                existing.TagName = request.TagName;
                existing.Note = request.Note;
                
                _tagService.UpdateTag(existing);
                return Ok(new ApiResponse("Tag updated successfully.", "200", existing));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse(ex.Message, "400"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "1")]
        public IActionResult DeleteTag(int id)
        {
            var existing = _tagService.GetTagById(id);
            if (existing == null)
                return NotFound(new ApiResponse("Tag not found.", "404"));

            _tagService.DeleteTag(id);
            return Ok(new ApiResponse("Tag deleted successfully.", "200"));
        }

        [HttpGet("search")]
        [Authorize]
        public IActionResult SearchTags(string? name)
        {
            var tags = _tagService.SearchTags(name);
            return Ok(new ApiResponse("Tags searched successfully.", "200", tags));
        }
    }
}
