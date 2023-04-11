using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wheelerz.Models;
using Wheelerz.Services;

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
        public List<Country>? GetCountries()
        {
            return _countryService.GetCountries();
        }

        [HttpGet("states/{countryId}")]
        public List<State>? GetStates(int countryId)
        {
            return _countryService.GetStates(countryId);
        }

    }
}
