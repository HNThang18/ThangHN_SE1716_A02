#nullable disable
using System.ComponentModel.DataAnnotations;

namespace BO.DTO
{
    public class UpdateAccountRequest
    {
        [Required(ErrorMessage = "AccountId is required.")]
        public int AccountId { get; set; }
        
        [Required(ErrorMessage = "AccountName is required.")]
        public string AccountName { get; set; }
        
        [Required(ErrorMessage = "AccountEmail is required.")]
        public string AccountEmail { get; set; }
        
        [Required(ErrorMessage = "Role is required.")]
        public int AccountRole { get; set; }
        
        // Password is optional for updates
        public string AccountPassword { get; set; }
    }
}
