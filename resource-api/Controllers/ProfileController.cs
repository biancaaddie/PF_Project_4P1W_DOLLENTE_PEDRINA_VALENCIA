using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using resource_api.Data;
using Microsoft.AspNetCore.RateLimiting;

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
        [EnableRateLimiting("public-read")]
        public async Task<IActionResult> GetProgress()
        {
            var progress = await _context.PlayerProgress.FirstOrDefaultAsync();

            var recentPuzzles = await _context.PlayerPuzzleStates
                .Where(x => x.Solved && x.SolvedAtUtc != null)
                .OrderByDescending(x => x.SolvedAtUtc)
                .Join(
                    _context.Puzzles,
                    state => state.PuzzleId,
                    puzzle => puzzle.Id,
                    (state, puzzle) => new
                    {
                        puzzleId = puzzle.Id,
                        answer = puzzle.Answer,
                        solvedAtUtc = state.SolvedAtUtc
                    }
                )
                .Take(5)
                .ToListAsync();

            if (progress == null)
            {
                return Ok(new
                {
                    solved = 0,
                    attempts = 0,
                    score = 0,
                    recentPuzzles = new object[] { }
                });
            }

            return Ok(new
            {
                solved = progress.Solved,
                attempts = progress.Attempts,
                score = progress.Score,
                recentPuzzles = recentPuzzles
            });
        }
    }
}
