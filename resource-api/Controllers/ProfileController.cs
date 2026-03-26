using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using resource_api.Data;

namespace resource_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ResourceDbContext _context;

        public ProfileController(ResourceDbContext context)
        {
            _context = context;
        }

        [HttpGet("progress")]
        public async Task<IActionResult> GetProgress()
        {
            var progress = await _context.PlayerProgress.FirstOrDefaultAsync();

            if (progress == null)
            {
                return Ok(new
                {
                    solved = 0,
                    attempts = 0,
                    score = 0
                });
            }

            return Ok(new
            {
                solved = progress.Solved,
                attempts = progress.Attempts,
                score = progress.Score
            });
        }
    }
}