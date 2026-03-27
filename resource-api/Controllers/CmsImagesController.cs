using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using resource_api.Data;
using resource_api.Dtos;
using resource_api.Models;

namespace resource_api.Controllers
{
    [ApiController]
    [Route("api/cms/images")]
    [Authorize(Roles = "admin")]
    public class CmsImagesController : ControllerBase
    {
        private readonly ResourceDbContext _db;
        private readonly IConfiguration _config;

        public CmsImagesController(ResourceDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CmsImageDto>>> GetAll([FromQuery] int? tagId = null)
        {
            var query = _db.CmsImages
                .Include(i => i.ImageTags)
                .ThenInclude(it => it.Tag)
                .AsQueryable();

            if (tagId.HasValue)
            {
                query = query.Where(i => i.ImageTags.Any(it => it.TagId == tagId.Value));
            }

            var images = await query
                .OrderByDescending(i => i.CreatedAtUtc)
                .Select(i => new CmsImageDto(
                    i.Id,
                    i.Url,
                    i.Name,
                    i.CreatedAtUtc,
                    i.ImageTags
                        .Select(it => new TagDto(it.Tag.Id, it.Tag.Name))
                        .OrderBy(t => t.Name)
                        .ToList()
                ))
                .ToListAsync();

            return Ok(images);
        }

        // Create image record from an existing URL (admin supplies the URL).
        [HttpPost("from-url")]
        public async Task<ActionResult<CmsImageDto>> CreateFromUrl([FromBody] CreateImageFromUrlRequest request)
        {
            var url = (request.Url ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(url))
            {
                return BadRequest(new { message = "Url is required." });
            }

            var image = new CmsImage
            {
                Url = url,
                Name = string.IsNullOrWhiteSpace(request.Name) ? null : request.Name.Trim()
            };

            _db.CmsImages.Add(image);
            await _db.SaveChangesAsync();

            return Ok(new CmsImageDto(image.Id, image.Url, image.Name, image.CreatedAtUtc, new List<TagDto>()));
        }

        // Upload a file (multipart/form-data) and create an image record.
        [HttpPost("upload")]
        [RequestSizeLimit(10_000_000)] // hard cap; config below enforces the real cap
        public async Task<ActionResult<CmsImageDto>> Upload([FromForm] IFormFile file, [FromForm] string? name = null)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "File is required." });
            }

            var maxBytes = _config.GetValue<long>("Uploads:MaxBytes", 5 * 1024 * 1024);
            if (file.Length > maxBytes)
            {
                return BadRequest(new { message = $"File too large. Max {maxBytes} bytes." });
            }

            var allowed = _config.GetSection("Uploads:AllowedContentTypes").Get<string[]>() ?? Array.Empty<string>();
            if (allowed.Length > 0 && !allowed.Contains(file.ContentType))
            {
                return BadRequest(new { message = "Unsupported file type." });
            }

            // Store in wwwroot/uploads so it can be served by UseStaticFiles().
            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            Directory.CreateDirectory(uploadsDir);

            var ext = Path.GetExtension(file.FileName);
            var storedFileName = $"{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(uploadsDir, storedFileName);

            await using (var stream = System.IO.File.Create(fullPath))
            {
                await file.CopyToAsync(stream);
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var publicUrl = $"{baseUrl}/uploads/{storedFileName}";

            var image = new CmsImage
            {
                Url = publicUrl,
                Name = string.IsNullOrWhiteSpace(name) ? null : name.Trim()
            };

            _db.CmsImages.Add(image);
            await _db.SaveChangesAsync();

            return Ok(new CmsImageDto(image.Id, image.Url, image.Name, image.CreatedAtUtc, new List<TagDto>()));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var image = await _db.CmsImages
                .Include(i => i.ImageTags)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (image == null)
            {
                return NotFound();
            }

            // Remove mappings first.
            _db.ImageTags.RemoveRange(image.ImageTags);
            _db.CmsImages.Remove(image);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        // Map a tag to an image: POST /api/cms/images/{id}/tags  { "tagId": 123 }
        [HttpPost("{id:int}/tags")]
        public async Task<IActionResult> AddTag(int id, [FromBody] AddImageTagRequest request)
        {
            var imageExists = await _db.CmsImages.AnyAsync(i => i.Id == id);
            if (!imageExists) return NotFound(new { message = "Image not found." });

            var tagExists = await _db.Tags.AnyAsync(t => t.Id == request.TagId);
            if (!tagExists) return NotFound(new { message = "Tag not found." });

            var already = await _db.ImageTags.AnyAsync(it => it.ImageId == id && it.TagId == request.TagId);
            if (already) return NoContent();

            _db.ImageTags.Add(new ImageTag { ImageId = id, TagId = request.TagId });
            await _db.SaveChangesAsync();

            return NoContent();
        }

        // Unmap a tag from an image: DELETE /api/cms/images/{id}/tags/{tagId}
        [HttpDelete("{id:int}/tags/{tagId:int}")]
        public async Task<IActionResult> RemoveTag(int id, int tagId)
        {
            var mapping = await _db.ImageTags.FirstOrDefaultAsync(it => it.ImageId == id && it.TagId == tagId);
            if (mapping == null) return NoContent();

            _db.ImageTags.Remove(mapping);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}

