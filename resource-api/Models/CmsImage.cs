using System.ComponentModel.DataAnnotations;

namespace resource_api.Models
{
    public class CmsImage
    {
        public int Id { get; set; }

        // Publicly reachable URL used by the web-app (could be local dev URL or later a CDN URL).
        [Required]
        public string Url { get; set; } = string.Empty;

        // Optional: original file name or a friendly label entered by an admin.
        public string? Name { get; set; }

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        public ICollection<ImageTag> ImageTags { get; set; } = new List<ImageTag>();
    }
}

