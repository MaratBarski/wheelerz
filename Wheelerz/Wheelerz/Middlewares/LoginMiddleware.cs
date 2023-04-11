using Wheelerz.Services;

namespace Wheelerz.Middlewares
{
    public class LoginMiddleware
    {
        private readonly RequestDelegate _next;

        public LoginMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext httpContext, IAuthService authService)
        {
            httpContext.Items["login"] = authService.ValidateUser(httpContext.Request.Headers.Authorization);
            return _next(httpContext);
        }
    }

    public static class MyMiddlewareExtensions
    {
        public static IApplicationBuilder UseLoginMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<LoginMiddleware>();
        }
    }
}
