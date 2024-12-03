using AskMate.Middleware;
using AskMate.Models.Repos;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IAskMateDatabase>(provider =>
    new AskMateDatabase(new NpgsqlConnection("Server=localhost;Port=5432;User Id=postgres;Password=236231;Database=ask_mate")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCorsMiddleware();

app.UseAuthorization();

app.MapControllers();

app.Run();