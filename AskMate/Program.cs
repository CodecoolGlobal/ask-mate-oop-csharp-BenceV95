using AskMate.Middleware;
using AskMate.Repos;
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

//add authetication
app.UseAuthentication();

app.UseCorsMiddleware(); // change it to use proxy eventually !!!

app.UseAuthorization();

app.MapControllers();

//built in cors
app.UseCors("AllowFrontend");

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
            options.Cookie.Name = "UserAuthCookie"; // Name of the cookie
            options.LoginPath = "/User/login";     // Redirect to login if unauthorized
            options.AccessDeniedPath = "/User/denied"; // Redirect if access is denied
            options.ExpireTimeSpan = TimeSpan.FromHours(1); // Expiration
        });

    //built in cors -> change it to be a proxy !!!
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
}