using Microsoft.AspNetCore.Mvc;
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
            return _countryService.GetCountries();
        }

        [HttpGet("states/{countryId}")]
        public IEnumerable<State> GetStates(int countryId)
        {
            return _countryService.GetStates(countryId);
        }

        [HttpPost]
        public void AddAll(List<Country> c)
        {
            _countryService.AddAll(c);
        }

    }
}
