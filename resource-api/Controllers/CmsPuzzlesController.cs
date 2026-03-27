using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using resource_api.Data;
using resource_api.Dtos;
using resource_api.Models;

namespace resource_api.Controllers
{
    [ApiController]
    [Route("api/cms/puzzles")]
    [Authorize(Roles = "admin")] // ITERATION 5: Ensures security on Cms Puzzles Controller
    public class CmsPuzzlesController : ControllerBase
    {
        private readonly ResourceDbContext _db;

        public CmsPuzzlesController(ResourceDbContext db)
        {
            _db = db;
        }

        // ITERATION 5: Fetch all puzzles connected to a specific packId
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Puzzle>>> GetByPackId([FromQuery] int packId)
        {
            var puzzles = await _db.Puzzles
                .Where(p => p.PackId == packId)
                .OrderBy(p => p.Order)
                .ToListAsync();

            return Ok(puzzles);
        }

        // ITERATION 5: Create a new puzzle explicitly wired to a pack ID (from within the form inputs or Query strings)
        [HttpPost]
        public async Task<ActionResult<Puzzle>> Create([FromQuery] int packId, [FromBody] CreatePuzzleRequest request)
        {
            var packExists = await _db.Packs.AnyAsync(p => p.Id == packId);
            if (!packExists) return NotFound(new { message = "Pack not found." });

            var answer = request.Answer?.Trim().ToUpperInvariant(); // Iteration 5 puzzle normalization details
            if (string.IsNullOrWhiteSpace(answer))
            {
                return BadRequest(new { message = "Answer is required." });
            }

            var nextOrder = await _db.Puzzles.Where(p => p.PackId == packId).Select(p => p.Order).DefaultIfEmpty(-1).MaxAsync() + 1;

            var puzzle = new Puzzle
            {
                PackId = packId,
                Order = nextOrder,
                Answer = answer,
                Image1Url = request.Image1Url,
                Image2Url = request.Image2Url,
                Image3Url = request.Image3Url,
                Image4Url = request.Image4Url
            };

            _db.Puzzles.Add(puzzle);
            await _db.SaveChangesAsync();

            return Ok(puzzle);
        }

        // ITERATION 5: Update a puzzle's answers and images
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Puzzle>> Update(int id, [FromBody] UpdatePuzzleRequest request)
        {
            var puzzle = await _db.Puzzles.FindAsync(id);
            if (puzzle == null) return NotFound();

            var answer = request.Answer?.Trim().ToUpperInvariant(); // Normalize
            if (string.IsNullOrWhiteSpace(answer))
            {
                return BadRequest(new { message = "Answer is required." });
            }

            puzzle.Answer = answer;
            puzzle.Image1Url = request.Image1Url;
            puzzle.Image2Url = request.Image2Url;
            puzzle.Image3Url = request.Image3Url;
            puzzle.Image4Url = request.Image4Url;

            await _db.SaveChangesAsync();
            return Ok(puzzle);
        }

        // ITERATION 5: Admins can remove logic defects (like poorly named puzzles) via a delete button
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var puzzle = await _db.Puzzles.FindAsync(id);
            if (puzzle == null) return NotFound();

            _db.Puzzles.Remove(puzzle);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
