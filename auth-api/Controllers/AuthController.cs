using Microsoft.AspNetCore.Mvc;
using auth_api.Data;
using auth_api.Dtos;
using auth_api.Models;
using auth_api.Services;
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (existingUser != null)
                return BadRequest(new { message = "Email already exists." });

            var user = new User
            {
                Email = dto.Email,
                Password = dto.Password,
                Role = string.IsNullOrWhiteSpace(dto.Role) ? "player" : dto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered successfully"
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x =>
                x.Email == dto.Email && x.Password == dto.Password);

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