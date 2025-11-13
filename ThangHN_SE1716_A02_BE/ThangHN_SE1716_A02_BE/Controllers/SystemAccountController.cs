using BO.DTO;
using BO.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Service;

namespace ThangHN_SE1716_A02_BE.Controllers
{
    [ApiController]
    [Route("api/systemaccounts")]
    public class SystemAccountController : ControllerBase
    {
        private readonly ISystemAccountService _accountService;
        public SystemAccountController(ISystemAccountService AccountService)
        {
            _accountService = AccountService;
        }
        [HttpGet("odata")]
        [EnableQuery]
        [Authorize(Roles = "0")]
        public IActionResult GetOData()
        {
            var accounts = _accountService.GetAllSystemAccounts().AsQueryable();
            return Ok(accounts);
        }

        [HttpGet]
        [Authorize(Roles = "0")]
        public IActionResult GetAllSystemAccounts()
        {
            var accounts = _accountService.GetAllSystemAccounts();
            return Ok(new ApiResponse("System accounts retrieved successfully.", "200", accounts));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "0")]
        public IActionResult GetSystemAccountById(int id)
        {
            var account = _accountService.GetSystemAccountById(id);
            if (account == null)
                return NotFound(new ApiResponse("System account not found.", "404"));
            return Ok(new ApiResponse("System account retrieved successfully.", "200", account));
        }

        [HttpPost]
        [Authorize(Roles = "0")]
        public IActionResult CreateSystemAccount([FromBody] SystemAccount account)
        {
            try
            {
                _accountService.AddSystemAccount(account);
                return CreatedAtAction(nameof(GetSystemAccountById), new { id = account.AccountId }, new ApiResponse("System account created successfully.", "201", account));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse(ex.Message, "400"));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "0")]
        public IActionResult UpdateSystemAccount(int id, [FromBody] UpdateAccountRequest request)
        {
            if (id != request.AccountId)
                return BadRequest(new ApiResponse("ID mismatch.", "400"));

            var existing = _accountService.GetSystemAccountById(id);
            if (existing == null)
                return NotFound(new ApiResponse("System account not found.", "404"));

            try
            {
                // Update existing account properties
                existing.AccountName = request.AccountName;
                existing.AccountEmail = request.AccountEmail;
                existing.AccountRole = request.AccountRole;
                
                // Only update password if provided
                if (!string.IsNullOrEmpty(request.AccountPassword))
                {
                    existing.AccountPassword = request.AccountPassword;
                }
                
                _accountService.UpdateSystemAccount(existing);
                return Ok(new ApiResponse("System account updated successfully.", "200", existing));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse(ex.Message, "400"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "0")]
        public IActionResult DeleteSystemAccount(int id)
        {
            var existing = _accountService.GetSystemAccountById(id);
            if (existing == null)
                return NotFound(new ApiResponse("System account not found.", "404"));

            try
            {
                if (_accountService.CanDeleteSystemAccount(id))
                {
                    _accountService.DeleteSystemAccount(id);
                    return Ok(new ApiResponse("System account deleted successfully.", "200"));
                }
                else
                {
                    return BadRequest(new ApiResponse("Cannot delete system account that has created or updated news articles.", "400"));
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse(ex.Message, "400"));
            }
        }

        [HttpGet("search")]
        [Authorize(Roles = "0")]
        public IActionResult SearchSystemAccounts([FromQuery] string? name, [FromQuery] string? email)
        {
            var accounts = _accountService.SearchSystemAccounts(name, email);
            return Ok(new ApiResponse("System accounts searched successfully.", "200", accounts));
        }

        [HttpGet("profile")]
        [Authorize(Roles = "1")]
        public IActionResult GetMyProfile()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var account = _accountService.GetSystemAccountById(userId);
            if (account == null)
                return NotFound(new ApiResponse("Profile not found.", "404"));
            return Ok(new ApiResponse("Profile retrieved successfully.", "200", account));
        }

        [HttpPut("profile")]
        [Authorize(Roles = "1")]
        public IActionResult UpdateMyProfile([FromBody] UpdateAccountRequest request)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            if (userId != request.AccountId)
                return BadRequest(new ApiResponse("You can only update your own profile.", "400"));

            var existing = _accountService.GetSystemAccountById(userId);
            if (existing == null)
                return NotFound(new ApiResponse("Profile not found.", "404"));

            try
            {
                // Update existing account properties
                existing.AccountName = request.AccountName;
                existing.AccountEmail = request.AccountEmail;
                existing.AccountRole = request.AccountRole;
                
                // Only update password if provided
                if (!string.IsNullOrEmpty(request.AccountPassword))
                {
                    existing.AccountPassword = request.AccountPassword;
                }
                
                _accountService.UpdateSystemAccount(existing);
                return Ok(new ApiResponse("Profile updated successfully.", "200", existing));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse(ex.Message, "400"));
            }
        }
    }
}
