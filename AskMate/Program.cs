using AskMate.Middleware;
using AskMate.Models.Repos;
using Microsoft.AspNetCore.Authentication.Cookies;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

string CONNECTIONSTRING = "Server=localhost;Port=5432;User Id=postgres;Password=Vonat2024;Database=ask_mate"; // make this to get from the env

var connection = new NpgsqlConnection(CONNECTIONSTRING);

//questions
builder.Services.AddScoped<IQuestionsRepo>(provider =>
new QuestionsRepo(connection));

//answers
builder.Services.AddScoped<IAnswersRepo>(provider =>
new AnswersRepo(connection));

//users
builder.Services.AddScoped<IUserRepo>(provider =>
new UserRepo(connection));




// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// use cookies
builder.Services.AddAuthentication("Cookies")
    .AddCookie("Cookies", options =>
    {
        options.Cookie.Name = "UserAuthCookie"; // Name of the cookie
        options.LoginPath = "/User/login";     // Redirect to login if unauthorized
        options.AccessDeniedPath = "/User/denied"; // Redirect if access is denied
        options.ExpireTimeSpan = TimeSpan.FromHours(1); // Expiration
    });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//add authetication
app.UseAuthentication();


app.UseCorsMiddleware();

app.UseAuthorization();

app.MapControllers();

app.Run();