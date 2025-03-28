using AskMate.Repos;
using AskMate.Repos.Answers;
using AskMate.Repos.Categories;
using AskMate.Repos.Questions;
using AskMate.Repos.Users;
using AskMate.Repos.Votes;

var builder = WebApplication.CreateBuilder(args);


string CONNECTIONSTRING = Environment.GetEnvironmentVariable("CONNECTION_STRING");

builder.Services.AddSingleton<string>(sp => CONNECTIONSTRING + "ask_mate;"+ "Pooling=true;"); // db_name + pooling


RegisterServices();
AddOptionsToRegisteredServices();

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


app.UseAuthorization();

app.MapControllers();


app.Run();

void RegisterServices()
{
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

    // swagger
    builder.Services.AddSwaggerGen();
}

void AddOptionsToRegisteredServices()
{
    // use cookies
    builder.Services.AddAuthentication("Cookies")
        .AddCookie("Cookies", options =>
        {
            options.Cookie.Name = "UserAuthCookie";              // Name of the cookie
            options.Cookie.HttpOnly = true;                       // Protect from JavaScript access
            options.Cookie.SameSite = SameSiteMode.Strict;          // Allow cross-origin cookies
            options.Cookie.SecurePolicy = CookieSecurePolicy.None; // Use 'Always' if you have HTTPS
            options.ExpireTimeSpan = TimeSpan.FromHours(1);       // Expiration time
            options.SlidingExpiration = true;                     // Extend expiration on activity
            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = 401; // Avoid redirect, just return Unauthorized
                return Task.CompletedTask;
            };

        });

}