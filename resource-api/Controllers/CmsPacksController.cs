using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using resource_api.Data;
using resource_api.Dtos;
using resource_api.Models;

namespace resource_api.Controllers
{
    [ApiController]
    [Route("api/cms/packs")]
    [Authorize(Roles = "admin")] // ITERATION 5: Admin auth required
    public class CmsPacksController : ControllerBase
    {
        private readonly ResourceDbContext _db;

        public CmsPacksController(ResourceDbContext db)
        {
            _db = db;
        }

        // ITERATION 5: GET /api/cms/packs - Fetch all packs for admin view
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pack>>> GetAll()
        {
            var packs = await _db.Packs.OrderBy(p => p.Id).ToListAsync();
            return Ok(packs);
        }

        // ITERATION 5: POST /api/cms/packs - Admin creates a new pack
        [HttpPost]
        public async Task<ActionResult<Pack>> Create([FromBody] CreatePackRequest request)
        {
            var name = request.Name?.Trim();
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new { message = "Pack name is required." });
            }

            var pack = new Pack
            {
                Name = name,
                Description = request.Description?.Trim() ?? string.Empty,
                Difficulty = request.Difficulty,
                IsPublished = false // Default to false upon creation
            };

            _db.Packs.Add(pack);
            await _db.SaveChangesAsync();

            return Ok(pack);
        }

        // ITERATION 5: PUT /api/cms/packs/{id} - Admin edits a pack
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Pack>> Update(int id, [FromBody] UpdatePackRequest request)
        {
            var pack = await _db.Packs.FindAsync(id);
            if (pack == null) return NotFound();

            var name = request.Name?.Trim();
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new { message = "Pack name is required." });
            }

            pack.Name = name;
            pack.Description = request.Description?.Trim() ?? string.Empty;
            pack.Difficulty = request.Difficulty;

            await _db.SaveChangesAsync();

            return Ok(pack);
        }

        // ITERATION 5: POST /api/cms/packs/{id}/publish - Admin toggles publishing state
        [HttpPost("{id:int}/publish")]
        public async Task<ActionResult<Pack>> TogglePublish(int id)
        {
            var pack = await _db.Packs.FindAsync(id);
            if (pack == null) return NotFound();

            pack.IsPublished = !pack.IsPublished;
            await _db.SaveChangesAsync();

            return Ok(pack);
        }

        // ITERATION 5: DELETE /api/cms/packs/{id} - Admin deletes pack
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pack = await _db.Packs.FindAsync(id);
            if (pack == null) return NotFound();

            // First delete attached puzzles to prevent referential errors depending on DB mapping
            var attachedPuzzles = _db.Puzzles.Where(p => p.PackId == id);
            _db.Puzzles.RemoveRange(attachedPuzzles);

            _db.Packs.Remove(pack);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
