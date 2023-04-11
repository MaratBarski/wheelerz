using Microsoft.AspNetCore.Mvc.Filters;

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
}
