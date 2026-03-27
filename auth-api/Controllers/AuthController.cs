using Microsoft.AspNetCore.Mvc;
using auth_api.Data;
using auth_api.Dtos;
using auth_api.Models;
using auth_api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;

namespace auth_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AuthDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
            var normalizedRole = dto.Role.Trim().ToLowerInvariant();
            var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.Email == normalizedEmail);

            if (existingUser != null)
                return BadRequest(new { message = "Email already exists." });

            var user = new User
            {
                Email = normalizedEmail,
                Password = dto.Password,
                Role = string.IsNullOrWhiteSpace(normalizedRole) ? "player" : normalizedRole
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered successfully"
            });
        }

        [HttpPost("login")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
            var user = await _context.Users.FirstOrDefaultAsync(x =>
                x.Email == normalizedEmail && x.Password == dto.Password);

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                token,
                email = user.Email,
                role = user.Role
            });
        }
    }
}
