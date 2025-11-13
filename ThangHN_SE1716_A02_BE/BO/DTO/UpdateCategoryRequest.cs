#nullable disable
using System.ComponentModel.DataAnnotations;

namespace BO.DTO
{
    public class UpdateCategoryRequest
    {
        [Required(ErrorMessage = "CategoryId is required.")]
        public int CategoryId { get; set; }
        
        [Required(ErrorMessage = "Category name is required.")]
        public string CategoryName { get; set; }
        
        public string CategoryDescription { get; set; }
        
        public int? ParentCategoryId { get; set; }
        
        [Required(ErrorMessage = "Category status is required.")]
        public bool IsActive { get; set; }
    }
}
