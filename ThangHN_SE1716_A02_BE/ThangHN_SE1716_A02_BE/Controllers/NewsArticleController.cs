using BO.DTO;
using BO.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Service;
using System.Security.Claims;

namespace ThangHN_SE1716_A02_BE.Controllers
{
    [ApiController]
    [Route("api/newsarticles")]
    public class NewsArticleController : ControllerBase
    {
        private readonly INewsArticleService _newsArticleService;
        public NewsArticleController(INewsArticleService newsArticleService)
        {
            _newsArticleService = newsArticleService;
        }

        [HttpGet("odata")]
        [EnableQuery]
        [AllowAnonymous]
        public IActionResult GetOData()
        {
            var articles = _newsArticleService.GetAllNewsArticles().AsQueryable();
            return Ok(articles);
        }

        [HttpGet]
        [Authorize(Roles = "0,1")]
        public IActionResult GetAllNewsArticles()
        {
            var articles = _newsArticleService.GetActiveNewsArticles();
            return Ok(new ApiResponse("News articles retrieved successfully.", "200", articles));
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetNewsArticleById(int id)
        {
            var article = _newsArticleService.GetNewsArticleById(id);
            if (article == null)
                return NotFound(new ApiResponse("News article not found.", "404"));
            return Ok(new ApiResponse("News article retrieved successfully.", "200", article));
        }

        [HttpPost]
        [Authorize(Roles = "1")]
        public IActionResult CreateNewsArticle([FromBody] CreateNewsArticleRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                
                var newsArticle = new NewsArticle
                {
                    NewsTitle = request.NewsTitle,
                    Headline = request.Headline,
                    NewsContent = request.NewsContent,
                    NewsSource = request.NewsSource,
                    CategoryId = request.CategoryId,
                    NewsStatus = request.NewsStatus
                };
                
                _newsArticleService.AddNewsArticle(newsArticle, userId);
                return CreatedAtAction(nameof(GetNewsArticleById), new { id = newsArticle.NewsArticleId }, new ApiResponse("News article created successfully.", "201", newsArticle));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse(ex.Message, "400"));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "1")]
        public IActionResult UpdateNewsArticle(int id, [FromBody] UpdateNewsArticleRequest request)
        {
            if (id != request.NewsArticleId)
                return BadRequest(new ApiResponse("ID mismatch.", "400"));

            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                
                var newsArticle = new NewsArticle
                {
                    NewsArticleId = request.NewsArticleId,
                    NewsTitle = request.NewsTitle,
                    Headline = request.Headline,
                    NewsContent = request.NewsContent,
                    NewsSource = request.NewsSource,
                    CategoryId = request.CategoryId,
                    NewsStatus = request.NewsStatus
                };
                
                _newsArticleService.UpdateNewsArticle(newsArticle, userId);
                
                return Ok(new ApiResponse("News article updated successfully.", "200", newsArticle));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse(ex.Message, "400"));
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new ApiResponse(ex.Message, "404"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "1")]
        public IActionResult DeleteNewsArticle(int id)
        {
            var existing = _newsArticleService.GetNewsArticleById(id);
            if (existing == null)
                return NotFound(new ApiResponse("News article not found.", "404"));

            _newsArticleService.DeleteNewsArticle(id);
            return Ok(new ApiResponse("News article deleted successfully.", "200"));
        }

        [HttpGet("search")]
        [Authorize(Roles = "0,1")]
        public IActionResult SearchNewsArticles([FromQuery] string? title, [FromQuery] int? categoryId, [FromQuery] string? tagName)
        {
            var articles = _newsArticleService.SearchNewsArticles(title, categoryId, tagName);
            return Ok(new ApiResponse("Search results retrieved successfully.", "200", articles));
        }

        [HttpGet("my-articles")]
        [Authorize(Roles = "1")]
        public IActionResult GetMyNewsArticles()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var articles = _newsArticleService.GetNewsArticlesByCreatedBy(userId);
            return Ok(new ApiResponse("Your news articles retrieved successfully.", "200", articles));
        }

        [HttpGet("report")]
        [Authorize(Roles = "0")]
        public IActionResult GetNewsReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var articles = _newsArticleService.GetNewsArticlesByDateRange(startDate, endDate)
                .OrderByDescending(na => na.CreatedDate);
            return Ok(new ApiResponse("News report generated successfully.", "200", articles));
        }
    }
}
