using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using resource_api.Data;
using resource_api.Models;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ResourceDbContext>(options =>
    options.UseInMemoryDatabase("ResourceDb"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });

builder.Services.AddAuthorization();

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

// Seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ResourceDbContext>();

    context.Database.EnsureDeleted();
    context.Database.EnsureCreated();

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

        context.Puzzles.AddRange(
            new Puzzle
            {
                Id = 1,
                PackId = 1,
                Answer = "cat",
                Image1Url = "https://placehold.co/300x200?text=Cat+1",
                Image2Url = "https://placehold.co/300x200?text=Cat+2",
                Image3Url = "https://placehold.co/300x200?text=Cat+3",
                Image4Url = "https://placehold.co/300x200?text=Cat+4"
            },
            new Puzzle
            {
                Id = 2,
                PackId = 1,
                Answer = "dog",
                Image1Url = "https://placehold.co/300x200?text=Dog+1",
                Image2Url = "https://placehold.co/300x200?text=Dog+2",
                Image3Url = "https://placehold.co/300x200?text=Dog+3",
                Image4Url = "https://placehold.co/300x200?text=Dog+4"
            },
            new Puzzle
            {
                Id = 3,
                PackId = 2,
                Answer = "apple",
                Image1Url = "https://placehold.co/300x200?text=Apple+1",
                Image2Url = "https://placehold.co/300x200?text=Apple+2",
                Image3Url = "https://placehold.co/300x200?text=Apple+3",
                Image4Url = "https://placehold.co/300x200?text=Apple+4"
            },
            new Puzzle
            {
                Id = 4,
                PackId = 2,
                Answer = "bread",
                Image1Url = "https://placehold.co/300x200?text=Bread+1",
                Image2Url = "https://placehold.co/300x200?text=Bread+2",
                Image3Url = "https://placehold.co/300x200?text=Bread+3",
                Image4Url = "https://placehold.co/300x200?text=Bread+4"
            },
            new Puzzle
            {
                Id = 5,
                PackId = 3,
                Answer = "book",
                Image1Url = "https://placehold.co/300x200?text=Book+1",
                Image2Url = "https://placehold.co/300x200?text=Book+2",
                Image3Url = "https://placehold.co/300x200?text=Book+3",
                Image4Url = "https://placehold.co/300x200?text=Book+4"
            },
            new Puzzle
            {
                Id = 6,
                PackId = 3,
                Answer = "pen",
                Image1Url = "https://placehold.co/300x200?text=Pen+1",
                Image2Url = "https://placehold.co/300x200?text=Pen+2",
                Image3Url = "https://placehold.co/300x200?text=Pen+3",
                Image4Url = "https://placehold.co/300x200?text=Pen+4"
            },
            new Puzzle
            {
                Id = 7,
                PackId = 4,
                Answer = "plane",
                Image1Url = "https://placehold.co/300x200?text=Plane+1",
                Image2Url = "https://placehold.co/300x200?text=Plane+2",
                Image3Url = "https://placehold.co/300x200?text=Plane+3",
                Image4Url = "https://placehold.co/300x200?text=Plane+4"
            },
            new Puzzle
            {
                Id = 8,
                PackId = 4,
                Answer = "train",
                Image1Url = "https://placehold.co/300x200?text=Train+1",
                Image2Url = "https://placehold.co/300x200?text=Train+2",
                Image3Url = "https://placehold.co/300x200?text=Train+3",
                Image4Url = "https://placehold.co/300x200?text=Train+4"
            }
        );

        context.PlayerProgress.Add(new PlayerProgress
        {
            Id = 1,
            Solved = 0,
            Attempts = 0,
            Score = 0
        });

        context.SaveChanges();
    }
}

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseStaticFiles(); // serve uploaded images from wwwroot (dev-friendly)

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();