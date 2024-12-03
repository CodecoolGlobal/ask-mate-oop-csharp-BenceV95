using AskMate.Middleware;
using AskMate.Models.Repos;
using Microsoft.AspNetCore.Authentication.Cookies;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IAskMateDatabase>(provider =>
new AskMateDatabase(new NpgsqlConnection("Server=localhost;Port=5432;User Id=postgres;Password=Vonat2024;Database=ask_mate"))); // enter pw


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// use cookies
builder.Services.AddAuthentication("CookieAuth")
    .AddCookie("CookieAuth", options =>
    {
        options.Cookie.Name = "UserAuthCookie"; // Name of the cookie
        options.LoginPath = "/auth/login";     // Redirect to login if unauthorized
        options.AccessDeniedPath = "/auth/denied"; // Redirect if access is denied
        options.ExpireTimeSpan = TimeSpan.FromHours(1); // Expiration
    });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//add authetication%
app.UseAuthentication();


app.UseCorsMiddleware();

app.UseAuthorization();

app.MapControllers();

app.Run();