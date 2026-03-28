using System.ComponentModel.DataAnnotations;

namespace resource_api.Dtos
{
    public class CreateTagRequest
    {
        [Required]
        [StringLength(64, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;
    }

    public class CreateImageFromUrlRequest
    {
        [Required]
        [Url]
        [StringLength(1000)]
        public string Url { get; set; } = string.Empty;

        [StringLength(120)]
        public string? Name { get; set; }
    }

    public class AddImageTagRequest
    {
        [Range(1, int.MaxValue)]
        public int TagId { get; set; }
    }

    public class TagDto
    {
        public TagDto(int id, string name)
        {
            Id = id;
            Name = name;
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CmsImageDto
    {
        public CmsImageDto(int id, string url, string? name, DateTime createdAtUtc, List<TagDto> tags)
        {
            Id = id;
            Url = url;
            Name = name;
            CreatedAtUtc = createdAtUtc;
            Tags = tags;
        }

        public int Id { get; set; }
        public string Url { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public List<TagDto> Tags { get; set; }
    }

    public class CreatePackRequest
    {
        [Required]
        [StringLength(120, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [StringLength(400)]
        public string Description { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Difficulty { get; set; }
    }

    public class UpdatePackRequest
    {
        [Required]
        [StringLength(120, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [StringLength(400)]
        public string Description { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Difficulty { get; set; }
    }

    public class CreatePuzzleRequest
    {
        [Required]
        [StringLength(64, MinimumLength = 1)]
        public string Answer { get; set; } = string.Empty;

        [Required]
        [Url]
        [StringLength(1000)]
        public string Image1Url { get; set; } = string.Empty;

        [Required]
        [Url]
        [StringLength(1000)]
        public string Image2Url { get; set; } = string.Empty;

        [Required]
        [Url]
        [StringLength(1000)]
        public string Image3Url { get; set; } = string.Empty;

        [Required]
        [Url]
        [StringLength(1000)]
        public string Image4Url { get; set; } = string.Empty;
    }

    public class UpdatePuzzleRequest
    {
        [Required]
        [StringLength(64, MinimumLength = 1)]
        public string Answer { get; set; } = string.Empty;

        [Required]
        [Url]
        [StringLength(1000)]
        public string Image1Url { get; set; } = string.Empty;

        [Required]
        [Url]
        [StringLength(1000)]
        public string Image2Url { get; set; } = string.Empty;

        [Required]
        [Url]
        [StringLength(1000)]
        public string Image3Url { get; set; } = string.Empty;

        [Required]
        [Url]
        [StringLength(1000)]
        public string Image4Url { get; set; } = string.Empty;
    }
}
