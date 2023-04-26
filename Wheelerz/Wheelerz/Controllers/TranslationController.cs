using Microsoft.AspNetCore.Mvc;
using Wheelerz.Filters;
using Wheelerz.Helpers;
using Wheelerz.Models;
using Wheelerz.Services;

namespace Wheelerz.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TranslationController : ControllerBase
    {
        private readonly ITranslationService _translationService;
        private IUserService _userService;

        public TranslationController(ITranslationService translationService, IUserService userService)
        {
            _translationService = translationService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IEnumerable<Translation>> GetTranslation()
        {
            var lang = Util.GetQueryParam(Request, "lang", _userService.CurrentUser.lang);
            return await _translationService.GetTanslations(lang);
        }


        [HttpGet("get")]
        public async Task<Dictionary<string, string>> Get()
        {
            var lang = Util.GetQueryParam(Request, "lang",
                _userService.CurrentUser?.lang != null ?
                _userService.CurrentUser.lang : "en");
            return await _translationService.Get(lang);
        }

        [HttpGet("all")]
        public async Task<IEnumerable<Translation>> GetAllTranslation()
        {
            return await _translationService.GetTanslations();
        }

        [HttpPost]
        [AdminFilter]
        public async Task AddTranslation(Translation translation)
        {
            await _translationService.AddTranslation(translation);
        }

        [HttpDelete("{key}")]
        [AdminFilter]
        public async Task AddTranslation(string key)
        {
            await _translationService.DeleteTranslation(key);
        }
    }
}
