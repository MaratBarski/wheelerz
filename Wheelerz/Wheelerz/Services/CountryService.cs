using Wheelerz.Models;

namespace Wheelerz.Services
{
    public interface ICountryService
    {
        void AddAll(IEnumerable<Country> countries);
        IEnumerable<Country> GetCountries(bool exists = false);
        IEnumerable<State> GetStates(int coutryId, bool exists = false);
    }
    public class CountryService : ICountryService
    {
        private readonly DataContext _data;
        public CountryService(DataContext data)
        {
            this._data = data;
        }
        public IEnumerable<Country> GetCountries(bool exists = false)
        {
            if (exists)
            {
                var ids = _data.Stories.Where(x => x.deleted == 0).Select(x => x.countryId).Distinct().ToList();
                return _data.Countries.Where(x => ids.Contains(x.id)).OrderBy(x => x.name).ToList();
            }
            return _data.Countries.OrderBy(x => x.name).ToList();
        }

        public IEnumerable<State> GetStates(int coutryId, bool exists = false)
        {
            if (exists)
            {
                var ids = _data.Stories.Where(x => x.deleted == 0).Select(x => x.cityId).Distinct().ToList();
                return _data.States.Where(x => x.countryId == coutryId && ids.Contains(x.id)).OrderBy(x => x.name).ToList();
            }
            return _data.States.Where(x => x.countryId == coutryId).OrderBy(x => x.name).ToList();
        }

        public void AddAll(IEnumerable<Country> countries)
        {
            _data.Countries.AddRange(countries);
            _data.SaveChanges();
        }
    }
}
