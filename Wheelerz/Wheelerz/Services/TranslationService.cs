using Microsoft.EntityFrameworkCore;
using Wheelerz.Models;

#pragma warning disable CS8619
#pragma warning disable CS8714

namespace Wheelerz.Services
{
    public interface ITranslationService
    {
        Task<List<Translation>> GetTanslations(string lang = "");
        Task AddTranslation(Translation translation);
        Task<Dictionary<string, string>> Get(string lang);
        Task DeleteTranslation(string key);
    }
    public class TranslationService : ITranslationService
    {
        private readonly DataContext _data;
        public TranslationService(DataContext dataContext)
        {
            _data = dataContext;
        }

        public Task AddTranslation(Translation translation)
        {
            return Task.Run(async () =>
            {
                var t = await _data.Translations.FirstOrDefaultAsync(x => x.key == translation.key && x.lang == translation.lang);
                if (t != null) t.text = translation.text;
                else _data.Translations.Add(translation);

                await _data.SaveChangesAsync();
            });
        }

        public Task DeleteTranslation(string key)
        {
            return Task.Run(async () =>
            {
                var forDelete = _data.Translations.Where(x => x.key == key).ToList();
                _data.Translations.RemoveRange(forDelete);
                await _data.SaveChangesAsync();
            });
        }

        public Task<Dictionary<string, string>> Get(string lang)
        {
            return Task.Run(async () =>
           {
               return await _data.Translations.Where(x => x.lang == lang).ToDictionaryAsync(x => x.key, y => y.text);
           });
        }

        public Task<List<Translation>> GetTanslations(string lang = "")
        {
            return Task.Run(async () =>
            {
                return await _data.Translations.Where(x => string.IsNullOrEmpty(lang) || x.lang == lang)
                .OrderBy(x => x.key).ToListAsync();
            });
        }
    }
}
