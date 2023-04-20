using Microsoft.AspNetCore.Mvc;
using Wheelerz.Helpers;
using Wheelerz.Models;
using Wheelerz.Services;

#pragma warning disable CS8603

namespace Wheelerz.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly ICountryService _countryService;
        public CountryController(ICountryService countryService)
        {
            _countryService = countryService;
        }

        [HttpGet("countries")]
        public IEnumerable<Country> GetCountries()
        {
            var exists = bool.Parse(Util.GetQueryParam(Request, "exists", false));
            return _countryService.GetCountries(exists);
        }

        [HttpGet("states/{countryId}")]
        public IEnumerable<State> GetStates(int countryId)
        {
            var exists = bool.Parse(Util.GetQueryParam(Request, "exists", false));
            return _countryService.GetStates(countryId, exists);
        }

        [HttpPost]
        public void AddAll(List<Country> c)
        {
            _countryService.AddAll(c);
        }

    }
}
