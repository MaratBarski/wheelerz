using Wheelerz.Helpers;
using Wheelerz.Services;

#pragma warning disable CS8604

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
            var token = Util.GetQueryParam(httpContext.Request, "token", "");
            var lang = Util.GetQueryParam(httpContext.Request, "lang", httpContext.Request.Headers["lang"]);

            if (token == "") token = httpContext.Request.Headers.Authorization;

            httpContext.Items["login"] = authService.ValidateUser(token, lang);
            return _next(httpContext);

            //httpContext.Items["login"] = authService.ValidateUser(httpContext.Request.Headers.Authorization, httpContext.Request.Headers["lang"]);
            //return _next(httpContext);
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
