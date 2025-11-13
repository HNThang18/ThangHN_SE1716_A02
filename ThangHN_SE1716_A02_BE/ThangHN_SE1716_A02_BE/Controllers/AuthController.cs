using BO.DTO;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace ThangHN_SE1716_A02_BE.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ISystemAccountService _accountService;
        private readonly IJwtService _jwtService;
        public AuthController(ISystemAccountService accountService, IJwtService jwtService)
        {
            _accountService = accountService;
            _jwtService = jwtService;
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {

            var account = _accountService.GetSystemAccount(request.Email, request.Password);
            if (account == null)
            {
                return Unauthorized(new ApiResponse("Invalid email or password.", "401"));
            }

            if (account.AccountRole != 0 && account.AccountRole != 1)
            {
                return Unauthorized(new ApiResponse("Access denied. Only Admin and Staff can login.", "403"));
            }

            var token = _jwtService.GenerateToken(
                account.AccountId,
                account.AccountEmail,
                account.AccountRole);
            var refreshToken = _jwtService.GenerateRefreshToken();

            return Ok(new ApiResponse("Login successful.", "200", new { Token = token }));
        }
    }
}
