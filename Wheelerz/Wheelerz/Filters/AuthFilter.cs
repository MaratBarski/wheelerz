using Microsoft.AspNetCore.Mvc.Filters;
using Wheelerz.Helpers;
using Wheelerz.Models;
using Wheelerz.Services;
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
            else if (!(user as User).isAdmin)
                context.HttpContext.Response.StatusCode = 401;
        }
    }

    public class PermissionFilter : Attribute, IActionFilter
    {
        private readonly Permissions _permission;
        public PermissionFilter(Permissions permission )
        {
            _permission = permission;
        }
        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.Items["login"];
            if (user == null)
                context.HttpContext.Response.StatusCode = 401;
            if ((user as User).permission == 0) return;
            if(((user as User).permission & (int)_permission) == 0)
                context.HttpContext.Response.StatusCode = 401;
        }
    }
}
