namespace resource_api.Models
{
    public class Puzzle
    {
        public int Id { get; set; }
        public int PackId { get; set; }
        public int Order { get; set; }
        public string Answer { get; set; } = string.Empty;
        public string Image1Url { get; set; } = string.Empty;
        public string Image2Url { get; set; } = string.Empty;
        public string Image3Url { get; set; } = string.Empty;
        public string Image4Url { get; set; } = string.Empty;
    }
}