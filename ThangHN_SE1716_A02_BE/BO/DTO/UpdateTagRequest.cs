#nullable disable
using System.ComponentModel.DataAnnotations;

namespace BO.DTO
{
    public class UpdateTagRequest
    {
        [Required(ErrorMessage = "TagId is required.")]
        public int TagId { get; set; }
        
        [Required(ErrorMessage = "Tag name is required.")]
        public string TagName { get; set; }
        
        public string Note { get; set; }
    }
}
