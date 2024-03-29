﻿using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Wheelerz.Middlewares;
using Wheelerz.Services;

namespace Wheelerz
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddMvc(options => options.EnableEndpointRouting = false);

            services.Configure<FormOptions>(o => {
                o.ValueLengthLimit = 50000000;
                o.MultipartBodyLengthLimit = 50000000;
                o.MemoryBufferThreshold = 50000000;
            });

            services.AddSignalR();
            //services.AddTransient<ChatHub>();
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
                db.UseSqlServer(Configuration["connectionStrings:DbConnectionString"]);
            });

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();


            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            //app.UseCors(builder => builder
            //        .AllowAnyOrigin()
            //        .AllowAnyMethod()
            //        .AllowAnyHeader()
            //        );

            app.UseCors(builder => builder
                    .WithOrigins("http://localhost:4200")
                    .AllowAnyHeader()
                    .WithMethods("GET", "POST", "PUT", "DELETE")
                    .AllowCredentials());

            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Upload")),
                RequestPath = new PathString("/Upload")
            });

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

            //app.Map("/chatHub", map =>
            //{
            //    map.UseForwardedHeaders();
            //});

        }
    }
}
