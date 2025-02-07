using AskMate.Middleware;
using AskMate.Repos;
using AskMate.Repos.Answers;
using AskMate.Repos.Categories;
using AskMate.Repos.Questions;
using AskMate.Repos.Users;
using AskMate.Repos.Votes;

var builder = WebApplication.CreateBuilder(args);


string CONNECTIONSTRING = Environment.GetEnvironmentVariable("CONNECTION_STRING");

builder.Services.AddSingleton<string>(sp => CONNECTIONSTRING + "ask_mate;"+ "Pooling=true;"); // db_name + pooling


//questions
builder.Services.AddScoped<IQuestionsRepo, QuestionsRepo>();

//answers
builder.Services.AddScoped<IAnswersRepo, AnswersRepo>();

//users
builder.Services.AddScoped<IUserRepo, UserRepo>();

//categories
builder.Services.AddScoped<ICategoriesRepo, CategoriesRepo>();

//votes
builder.Services.AddScoped<IVotesRepo, VotesRepo>();


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

//built in cors

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
//add authetication
app.UseAuthentication();

app.UseCorsMiddleware();

app.UseAuthorization();

app.MapControllers();

//built in cors
app.UseCors("AllowFrontend");

app.Run();