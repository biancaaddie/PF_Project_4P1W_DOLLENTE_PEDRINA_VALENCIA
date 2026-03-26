using Microsoft.EntityFrameworkCore;
using resource_api.Data;
using resource_api.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ResourceDbContext>(options =>
    options.UseInMemoryDatabase("ResourceDb"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ResourceDbContext>();

    if (!context.Packs.Any())
    {
        context.Packs.AddRange(
            new Pack
            {
                Id = 1,
                Name = "Animals Pack",
                Description = "Guess animal-related words",
                IsPublished = true,
                Difficulty = 1
            },
            new Pack
            {
                Id = 2,
                Name = "Food Pack",
                Description = "Guess food-related words",
                IsPublished = true,
                Difficulty = 2
            },
            new Pack
            {
                Id = 3,
                Name = "School Pack",
                Description = "Guess school-related words",
                IsPublished = true,
                Difficulty = 1
            },
            new Pack
            {
                Id = 4,
                Name = "Travel Pack",
                Description = "Guess travel-related words",
                IsPublished = true,
                Difficulty = 2
            },
            new Pack
            {
                Id = 5,
                Name = "Hidden Draft Pack",
                Description = "This should not appear",
                IsPublished = false,
                Difficulty = 3
            }
        );

        context.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();