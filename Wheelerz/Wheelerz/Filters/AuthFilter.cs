using Microsoft.AspNetCore.Mvc.Filters;
using Wheelerz.Models;
#pragma warning disable CS8602

namespace Wheelerz.Filters
{
    public class AuthFilter : Attribute, IActionFilter
    {

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.Items["login"];
            if (user == null)
            {
                //throw new UnauthorizedAccessException("Invalid user");
                context.HttpContext.Response.StatusCode = 401;
            }
        }
    }

    public class AdminFilter : Attribute, IActionFilter
    {

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.Items["login"];
            if (user == null)
                context.HttpContext.Response.StatusCode = 401;
            else if ((user as User).isAdmin)
                context.HttpContext.Response.StatusCode = 401;
        }
    }
}
