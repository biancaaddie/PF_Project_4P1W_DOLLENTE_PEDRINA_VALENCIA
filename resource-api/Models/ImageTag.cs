namespace resource_api.Models
{
    public class ImageTag
    {
        public int ImageId { get; set; }
        public CmsImage Image { get; set; } = null!;

        public int TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }
}

