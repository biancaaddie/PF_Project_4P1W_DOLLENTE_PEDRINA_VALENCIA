using System.ComponentModel.DataAnnotations;

namespace resource_api.Models
{
    public class Tag
    {
        public int Id { get; set; }

        // Unique tag name for filtering + assignment (e.g., "animal", "food").
        [Required]
        [MaxLength(64)]
        public string Name { get; set; } = string.Empty;

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        public ICollection<ImageTag> ImageTags { get; set; } = new List<ImageTag>();
    }
}

