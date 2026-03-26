using Microsoft.EntityFrameworkCore;
using auth_api.Models;

namespace auth_api.Data
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
    }
}