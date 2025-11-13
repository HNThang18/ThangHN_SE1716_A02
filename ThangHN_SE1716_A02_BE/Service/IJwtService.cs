using System.Security.Claims;

namespace Service
{
    public interface IJwtService
    {
        string GenerateRefreshToken();
        string GenerateToken(int userId, string email, int roleId);
        ClaimsPrincipal ValidateToken(string token);
    }
}