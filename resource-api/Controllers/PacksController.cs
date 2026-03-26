using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using resource_api.Data;

namespace resource_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacksController : ControllerBase
    {
        private readonly ResourceDbContext _context;

        public PacksController(ResourceDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPacks([FromQuery] bool random = false)
        {
            var packs = await _context.Packs
                .Where(p => p.IsPublished)
                .ToListAsync();

            if (random)
            {
                packs = packs.OrderBy(x => Guid.NewGuid()).ToList();
            }

            return Ok(packs);
        }
    }
}