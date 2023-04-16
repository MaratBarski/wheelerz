using Wheelerz.Models;

namespace Wheelerz.Services
{
    public interface ICountryService
    {
        void AddAll(IEnumerable<Country> countries);
        IEnumerable<Country> GetCountries();
        IEnumerable<State> GetStates(int coutryId);
    }
    public class CountryService : ICountryService
    {
        private readonly DataContext _data;
        public CountryService(DataContext data)
        {
            this._data = data;
        }
        public IEnumerable<Country> GetCountries()
        {
            return _data.Countries.OrderBy(x => x.name).ToList();
        }

        public IEnumerable<State> GetStates(int coutryId)
        {
            return _data.States.Where(x=>x.countryId == coutryId).OrderBy(x=>x.name).ToList();
        }

        public void AddAll(IEnumerable<Country> countries)
        {
            _data.Countries.AddRange(countries);
            _data.SaveChanges();
        }
    }
}
