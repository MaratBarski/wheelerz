using Microsoft.AspNetCore.Rewrite;

namespace Wheelerz.Rewrite
{
    public class RewriteClient
    {
        public static void RewriteClientRequests(RewriteContext context)
        {
            var request = context.HttpContext.Request;
            if (request.Path.Value == null) return;

            if (request.Path.Value == "/" || request.Path.Value.Contains("client", StringComparison.OrdinalIgnoreCase))
            {
                if (Path.HasExtension(request.Path.Value)) return;

                context.Result = RuleResult.SkipRemainingRules;
                request.Path = "/Client/index.html";
                return;
            }

            //var path = Path.Combine(Directory.GetCurrentDirectory(), request.Path.Value);
            //if(!Directory.Exists(path) && !File.Exists(path))
            //{
            //    context.Result = RuleResult.SkipRemainingRules;
            //    request.Path = "/Client/index.html";
            //}
        }
    }
}
