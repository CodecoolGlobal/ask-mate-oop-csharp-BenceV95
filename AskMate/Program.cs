using AskMate.Repos;
using AskMate.Repos.Answers;
using AskMate.Repos.Categories;
using AskMate.Repos.Questions;
using AskMate.Repos.Users;
using AskMate.Repos.Votes;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddSingleton<string>(sp => connectionString);

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
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Use 'Always' if you have HTTPS
            options.ExpireTimeSpan = TimeSpan.FromHours(1);       // Expiration time
            options.SlidingExpiration = true;                     // Extend expiration on activity
            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = 401; // Avoid redirect, just return Unauthorized
                return Task.CompletedTask;
            };

        });

}