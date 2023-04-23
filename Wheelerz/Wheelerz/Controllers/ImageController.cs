using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wheelerz.Services;

namespace Wheelerz.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IUploadService _uploadService;

        public ImageController(IUploadService uploadService)
        {
            _uploadService = uploadService;
        }
        [HttpGet("{image}")]
        public async Task<IActionResult> GetImage(string image)
        {
            var bytes = await _uploadService.GetImageBytes(image);
            return File(bytes, "image/jpeg");
        }
    }
}
