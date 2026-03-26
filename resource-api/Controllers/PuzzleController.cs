using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using resource_api.Data;

namespace resource_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PuzzlesController : ControllerBase
    {
        private readonly ResourceDbContext _context;

        public PuzzlesController(ResourceDbContext context)
        {
            _context = context;
        }

        [HttpGet("next")]
        public async Task<IActionResult> GetNextPuzzle([FromQuery] int packId)
        {
            var solvedPuzzleIds = await _context.PlayerPuzzleStates
                .Where(x => x.Solved)
                .Select(x => x.PuzzleId)
                .ToListAsync();

            var availablePuzzles = await _context.Puzzles
                .Where(p => p.PackId == packId && !solvedPuzzleIds.Contains(p.Id))
                .ToListAsync();

            if (!availablePuzzles.Any())
            {
                return NotFound(new { message = "Pack completed. No more puzzles available." });
            }

            var nextPuzzle = availablePuzzles
                .OrderBy(x => Guid.NewGuid())
                .First();

            return Ok(new
            {
                id = nextPuzzle.Id,
                packId = nextPuzzle.PackId,
                image1Url = nextPuzzle.Image1Url,
                image2Url = nextPuzzle.Image2Url,
                image3Url = nextPuzzle.Image3Url,
                image4Url = nextPuzzle.Image4Url
            });
        }
    }
}