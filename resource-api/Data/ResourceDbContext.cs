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
    }
}