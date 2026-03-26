namespace resource_api.Models
{
    public class Pack
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public int Difficulty { get; set; }
    }
}