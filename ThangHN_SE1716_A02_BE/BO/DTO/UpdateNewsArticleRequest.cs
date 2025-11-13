#nullable disable
using System.ComponentModel.DataAnnotations;

namespace BO.DTO
{
    public class UpdateNewsArticleRequest
    {
        [Required(ErrorMessage = "NewsArticleId is required.")]
        public int NewsArticleId { get; set; }
        
        [Required(ErrorMessage = "News title is required.")]
        public string NewsTitle { get; set; }
        
        [Required(ErrorMessage = "Headline is required.")]
        public string Headline { get; set; }
        
        public string NewsContent { get; set; }
        
        public string NewsSource { get; set; }
        
        [Required(ErrorMessage = "CategoryId is required.")]
        public int CategoryId { get; set; }
        
        [Required(ErrorMessage = "News status is required.")]
        public bool NewsStatus { get; set; }
        
        // Tags are optional
        public List<int> TagIds { get; set; }
    }
}
