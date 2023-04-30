using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Wheelerz;
using Wheelerz.Middlewares;
using Wheelerz.Rewrite;
using Wheelerz.Services;

#pragma warning disable SYSLIB0020

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
services.AddCors();

services.AddMvc(options => options.EnableEndpointRouting = false)
    .AddJsonOptions(options => { 
        options.JsonSerializerOptions.IgnoreNullValues = true;
    });

services.Configure<FormOptions>(o =>
{
    o.ValueLengthLimit = 50000000;
    o.MultipartBodyLengthLimit = 50000000;
    o.MemoryBufferThreshold = 50000000;
});

services.AddSignalR();

services.AddSingleton<IChatService, ChatService>();
services.AddSingleton<IPermissionsService, PermissionsService>();

services.AddTransient<IUserService, UserService>();
services.AddTransient<ICountryService, CountryService>();
services.AddTransient<IStoryService, StoryService>();
services.AddTransient<IAuthService, AuthService>();
services.AddTransient<IUploadService, UploadService>();
services.AddTransient<ITranslationService, TranslationService>();

services.AddDbContext<DataContext>(db =>
{
    db.UseSqlServer(builder.Configuration["connectionStrings:DbConnectionString"]);
});

services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();


services.AddControllers();

builder.Services.AddControllersWithViews();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseRewriter(new RewriteOptions().Add(RewriteClient.RewriteClientRequests));

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.UseCors(builder => builder
        .WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .WithMethods("GET", "POST", "PUT", "DELETE")
        .AllowCredentials());

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Upload")),
    RequestPath = new PathString("/Upload")
});

app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Client")),
    RequestPath = new PathString("/Client")
});

app.UseDefaultFiles();

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.UseLoginMiddleware();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ChatHub>("/chatHub", options =>
    {
    });
});

app.Run();



//namespace Wheelerz
//{
//    public class Program
//    {
//        public static void Main(string[] args)
//        {
//            CreateHostBuilder(args).Build().Run();
//        }

//        public static IHostBuilder CreateHostBuilder(string[] args) =>
//            Host.CreateDefaultBuilder(args)
//                .ConfigureWebHostDefaults(webBuilder =>
//                {
//                    webBuilder.UseStartup<Startup>();
//                });
//    }
//}
