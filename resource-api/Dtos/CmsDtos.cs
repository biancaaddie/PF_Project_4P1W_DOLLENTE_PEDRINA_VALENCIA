using System.ComponentModel.DataAnnotations;

namespace resource_api.Dtos
{
    public record CreateTagRequest(
        [property: Required, StringLength(64, MinimumLength = 2)] string Name
    );

    public record CreateImageFromUrlRequest(
        [property: Required, Url, StringLength(1000)] string Url,
        [property: StringLength(120)] string? Name
    );

    public record AddImageTagRequest(
        [property: Range(1, int.MaxValue)] int TagId
    );

    public record TagDto(int Id, string Name);

    public record CmsImageDto(int Id, string Url, string? Name, DateTime CreatedAtUtc, List<TagDto> Tags);

    public record CreatePackRequest(
        [property: Required, StringLength(120, MinimumLength = 2)] string Name,
        [property: StringLength(400)] string Description,
        [property: Range(1, 5)] int Difficulty
    );

    public record UpdatePackRequest(
        [property: Required, StringLength(120, MinimumLength = 2)] string Name,
        [property: StringLength(400)] string Description,
        [property: Range(1, 5)] int Difficulty
    );

    public record CreatePuzzleRequest(
        [property: Required, StringLength(64, MinimumLength = 1)] string Answer,
        [property: Required, Url, StringLength(1000)] string Image1Url,
        [property: Required, Url, StringLength(1000)] string Image2Url,
        [property: Required, Url, StringLength(1000)] string Image3Url,
        [property: Required, Url, StringLength(1000)] string Image4Url
    );

    public record UpdatePuzzleRequest(
        [property: Required, StringLength(64, MinimumLength = 1)] string Answer,
        [property: Required, Url, StringLength(1000)] string Image1Url,
        [property: Required, Url, StringLength(1000)] string Image2Url,
        [property: Required, Url, StringLength(1000)] string Image3Url,
        [property: Required, Url, StringLength(1000)] string Image4Url
    );
}
