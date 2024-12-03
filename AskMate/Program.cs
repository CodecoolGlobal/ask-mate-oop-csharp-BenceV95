using AskMate.Middleware;
using AskMate.Models.Repos;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IAskMateDatabase>(provider =>
new AskMateDatabase(new NpgsqlConnection("Server=localhost;Port=5432;User Id=molnarimi0211;Password=admin;Database=ask_mate"))); // enter pw

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
