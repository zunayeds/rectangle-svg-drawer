using FluentValidation;
using Rectangle_SVG_Drawer.API.Filters;
using Rectangle_SVG_Drawer.API.Models;
using Rectangle_SVG_Drawer.API.Services;
using Rectangle_SVG_Drawer.API.Validators;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ExceptionFilter>();
});

builder.Services.AddSingleton<IValidator<Rectangle>, RectangleValidator>();
builder.Services.AddSingleton<IFileService, FileService>();
builder.Services.AddSingleton<IRectangleService, RectangleService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("UiCorsPolicy",
        builder => builder.WithOrigins("http://localhost:5173") // To allow request from frontend
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors("UiCorsPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
