#nullable disable
using System.ComponentModel.DataAnnotations;

namespace BO.DTO
{
    public class CreateTagRequest
    {
        [Required(ErrorMessage = "Tag name is required.")]
        public string TagName { get; set; }
        
        public string Note { get; set; }
    }
}
