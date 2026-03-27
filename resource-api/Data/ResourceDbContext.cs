using Microsoft.EntityFrameworkCore;
using resource_api.Models;

namespace resource_api.Data
{
    public class ResourceDbContext : DbContext
    {
        public ResourceDbContext(DbContextOptions<ResourceDbContext> options) : base(options)
        {
        }

        public DbSet<Pack> Packs => Set<Pack>();
        public DbSet<Puzzle> Puzzles => Set<Puzzle>();
        public DbSet<PlayerProgress> PlayerProgress => Set<PlayerProgress>();
        public DbSet<PlayerPuzzleState> PlayerPuzzleStates => Set<PlayerPuzzleState>();
        public DbSet<CmsImage> CmsImages => Set<CmsImage>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<ImageTag> ImageTags => Set<ImageTag>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ImageTag is a pure join table; composite key avoids duplicate (ImageId, TagId) pairs.
            modelBuilder.Entity<ImageTag>()
                .HasKey(it => new { it.ImageId, it.TagId });

            modelBuilder.Entity<ImageTag>()
                .HasOne(it => it.Image)
                .WithMany(i => i.ImageTags)
                .HasForeignKey(it => it.ImageId);

            modelBuilder.Entity<ImageTag>()
                .HasOne(it => it.Tag)
                .WithMany(t => t.ImageTags)
                .HasForeignKey(it => it.TagId);
        }
    }
}