namespace resource_api.Dtos
{
    public record CreateTagRequest(string Name);

    public record CreateImageFromUrlRequest(string Url, string? Name);

    public record AddImageTagRequest(int TagId);

    public record TagDto(int Id, string Name);

    public record CmsImageDto(int Id, string Url, string? Name, DateTime CreatedAtUtc, List<TagDto> Tags);

    public record CreatePackRequest(string Name, string Description, int Difficulty);
    public record UpdatePackRequest(string Name, string Description, int Difficulty);
    
    public record CreatePuzzleRequest(string Answer, string Image1Url, string Image2Url, string Image3Url, string Image4Url);
    public record UpdatePuzzleRequest(string Answer, string Image1Url, string Image2Url, string Image3Url, string Image4Url);
}
