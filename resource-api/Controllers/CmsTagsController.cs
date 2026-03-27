using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using resource_api.Data;
using resource_api.Dtos;
using resource_api.Models;

namespace resource_api.Controllers
{
    [ApiController]
    [Route("api/cms/tags")]
    [Authorize(Roles = "admin")]
    public class CmsTagsController : ControllerBase
    {
        private readonly ResourceDbContext _db;

        public CmsTagsController(ResourceDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetAll()
        {
            var tags = await _db.Tags
                .OrderBy(t => t.Name)
                .Select(t => new TagDto(t.Id, t.Name))
                .ToListAsync();

            return Ok(tags);
        }

        [HttpPost]
        public async Task<ActionResult<TagDto>> Create([FromBody] CreateTagRequest request)
        {
            var name = (request.Name ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new { message = "Tag name is required." });
            }

            var normalized = name.ToLowerInvariant();
            var exists = await _db.Tags.AnyAsync(t => t.Name.ToLower() == normalized);
            if (exists)
            {
                return Conflict(new { message = "Tag already exists." });
            }

            var tag = new Tag { Name = name };
            _db.Tags.Add(tag);
            await _db.SaveChangesAsync();

            return Ok(new TagDto(tag.Id, tag.Name));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var tag = await _db.Tags.FirstOrDefaultAsync(t => t.Id == id);
            if (tag == null)
            {
                return NotFound();
            }

            // Remove mappings first (InMemory EF won't cascade reliably unless configured explicitly).
            var mappings = _db.ImageTags.Where(it => it.TagId == id);
            _db.ImageTags.RemoveRange(mappings);

            _db.Tags.Remove(tag);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}

