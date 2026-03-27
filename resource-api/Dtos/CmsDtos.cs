namespace resource_api.Dtos
{
    public record CreateTagRequest(string Name);

    public record CreateImageFromUrlRequest(string Url, string? Name);

    public record AddImageTagRequest(int TagId);

    public record TagDto(int Id, string Name);

    public record CmsImageDto(int Id, string Url, string? Name, DateTime CreatedAtUtc, List<TagDto> Tags);
}

