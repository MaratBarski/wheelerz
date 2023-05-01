using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Wheelerz.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CheckController : ControllerBase
    {
        [HttpGet]
        public string GetDate()
        {
            return DateTime.Now.ToString();
        }
    }
}
