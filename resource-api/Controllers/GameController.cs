using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using resource_api.Data;
using resource_api.Dtos;
using resource_api.Models;
using Microsoft.AspNetCore.RateLimiting;

namespace resource_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly ResourceDbContext _context;

        public GameController(ResourceDbContext context)
        {
            _context = context;
        }

        [HttpPost("submit")]
        [EnableRateLimiting("guess-submit")]
        public async Task<IActionResult> SubmitGuess([FromBody] SubmitGuessRequest request)
        {
            var puzzle = await _context.Puzzles.FirstOrDefaultAsync(p => p.Id == request.PuzzleId);

            if (puzzle == null)
            {
                return NotFound(new { message = "Puzzle not found." });
            }

            var progress = await _context.PlayerProgress.FirstOrDefaultAsync();

            if (progress == null)
            {
                progress = new PlayerProgress
                {
                    Solved = 0,
                    Attempts = 0,
                    Score = 0
                };

                _context.PlayerProgress.Add(progress);
                await _context.SaveChangesAsync();
            }

            progress.Attempts += 1;

            var normalizedGuess = Normalize(request.Guess);
            var normalizedAnswer = Normalize(puzzle.Answer);

            var correct = normalizedGuess == normalizedAnswer;
            var scoreDelta = 0;

            var existingState = await _context.PlayerPuzzleStates
                .FirstOrDefaultAsync(x => x.PuzzleId == puzzle.Id);

            if (correct)
            {
                if (existingState == null)
                {
                    existingState = new PlayerPuzzleState
                    {
                        PuzzleId = puzzle.Id,
                        Solved = true,
                        SolvedAtUtc = DateTime.UtcNow
                    };

                    _context.PlayerPuzzleStates.Add(existingState);
                    progress.Solved += 1;
                    progress.Score += 10;
                    scoreDelta = 10;
                }
                else if (!existingState.Solved)
                {
                    existingState.Solved = true;
                    existingState.SolvedAtUtc = DateTime.UtcNow;
                    progress.Solved += 1;
                    progress.Score += 10;
                    scoreDelta = 10;
                }
            }

            await _context.SaveChangesAsync();

            var solvedPuzzleIds = await _context.PlayerPuzzleStates
                .Where(x => x.Solved)
                .Select(x => x.PuzzleId)
                .ToListAsync();

            var nextAvailable = await _context.Puzzles
                .AnyAsync(p => p.PackId == puzzle.PackId && !solvedPuzzleIds.Contains(p.Id));

            return Ok(new
            {
                correct,
                scoreDelta,
                nextAvailable,
                totalSolved = progress.Solved,
                totalAttempts = progress.Attempts,
                totalScore = progress.Score
            });
        }

        [HttpPost("restart")]
        public async Task<IActionResult> RestartPack([FromQuery] int packId)
        {
            if (packId <= 0)
            {
                return BadRequest(new { message = "packId must be greater than 0." });
            }

            var puzzleIds = await _context.Puzzles
                .Where(p => p.PackId == packId)
                .Select(p => p.Id)
                .ToListAsync();

            var statesToRemove = await _context.PlayerPuzzleStates
                .Where(s => puzzleIds.Contains(s.PuzzleId))
                .ToListAsync();

            if (statesToRemove.Any())
            {
                _context.PlayerPuzzleStates.RemoveRange(statesToRemove);
            }

            var progress = await _context.PlayerProgress.FirstOrDefaultAsync();
            if (progress != null)
            {
                progress.Solved = 0;
                progress.Attempts = 0;
                progress.Score = 0;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Pack restarted.",
                packId = packId
            });
        }

        private static string Normalize(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return string.Empty;

            return value
                .Trim()
                .Replace(" ", "")
                .Replace("-", "")
                .ToLowerInvariant();
        }
    }
}
