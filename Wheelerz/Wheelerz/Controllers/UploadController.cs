using Microsoft.AspNetCore.Mvc;
using Wheelerz.Filters;
using Wheelerz.Services;

namespace Wheelerz.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [AuthFilter]
    public class UploadController : ControllerBase
    {
        private readonly IUploadService _uploadService;
        public UploadController(IUploadService uploadService)
        {
            _uploadService = uploadService;
        }

        [HttpPost]
        [RequestFormLimits(ValueLengthLimit = 40000000, MultipartBodyLengthLimit = 40000000)]
        [RequestSizeLimit(40000000)]
        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var pathToSave = this._uploadService.GetUploadDir();

                var name = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var fullPath = Path.Combine(pathToSave, name);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
                return Ok(new { fileName = name });
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{name}")]
        public IActionResult Delete(string name)
        {
            var path = Path.Combine(this._uploadService.GetUploadDir(), name);
            System.IO.File.Delete(path);
            return Ok(name);
        }
    }
}
