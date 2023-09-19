using Microsoft.EntityFrameworkCore;
using Wheelerz.Models;

namespace Wheelerz.Services
{
    public interface ICountryService
    {
        void AddAll(IEnumerable<Country> countries);
        Task<List<Country>> GetCountries(bool exists = false, int type = 0);
        Task<List<State>> GetStates(int coutryId, bool exists = false, int type = 0);
        void AddCountry(Country country);
        Task UpdateCountry(Country country);
    }
    public class CountryService : ICountryService
    {
        private readonly DataContext _data;
        private readonly IUserService _userService;
        public CountryService(DataContext data, IUserService userService)
        {
            _data = data;
            _userService = userService;
        }
        public Task<List<Country>> GetCountries(bool exists = false, int type = 0)
        {
            return Task.Run(async () =>
            {
                if (exists)
                {
                    var ids = await _data.Stories.Where(x => x.deleted == 0 && (type == 0 || x.storyType == type)).Select(x => x.countryId).Distinct().ToListAsync();
                    if (_userService.CurrentUser.lang == "he")
                        return await _data.Countries.Where(x => ids.Contains(x.id)).OrderBy(x => x.hebname).ToListAsync();
                    return await _data.Countries.Where(x => ids.Contains(x.id)).OrderBy(x => x.name).ToListAsync();
                }
                if (_userService.CurrentUser.lang == "he")
                    await _data.Countries.OrderBy(x => x.hebname).ToListAsync();
                return await _data.Countries.OrderBy(x => x.name).ToListAsync();
            });

        }

        public Task<List<State>> GetStates(int coutryId, bool exists = false, int type = 0)
        {
            return Task.Run(async () =>
            {
                if (exists)
                {
                    var ids = await _data.Stories.Where(x => x.deleted == 0 && (type == 0 || x.storyType == type)).Select(x => x.cityId).Distinct().ToListAsync();
                    return await _data.States.Where(x => x.countryId == coutryId && ids.Contains(x.id)).OrderBy(x => x.name).ToListAsync();
                }
                return await _data.States.Where(x => x.countryId == coutryId).OrderBy(x => x.name).ToListAsync();
            });
        }

        public void AddAll(IEnumerable<Country> countries)
        {
            _data.Countries.AddRange(countries);
            _data.SaveChanges();
        }

        public void AddCountry(Country country)
        {
            _data.Countries.Add(country);
            _data.SaveChanges();
        }

        public async Task UpdateCountry(Country country)
        {
            var c = await _data.Countries.Where(x => x.id == country.id).FirstOrDefaultAsync();
            if (c == null) return;
            c.name = country.name;
            c.hebname = country.hebname;
            _data.SaveChanges();
        }
    }
}
