using Microsoft.EntityFrameworkCore;
using Wheelerz.Models;

#pragma warning disable CS8620
#pragma warning disable CS8603

namespace Wheelerz.Services
{
    public interface IStoryService
    {
        Task<Story> Add(Story story);
        Task<List<Story>> GetAll();
        Task<List<Story>> GetStories(string q, int type, int userId = 0);
        Story GetStoryById(int id);
        Task Update(Story story);
    }
    public class StoryService : IStoryService
    {
        private readonly DataContext _data;
        private readonly IUploadService _uploadService;
        public StoryService(DataContext data, IUploadService uploadService)
        {
            _data = data;
            _uploadService = uploadService;
        }

        public Task<Story> Add(Story story)
        {
            return Task.Run(() =>
            {
                story.dateAdd = DateTime.Now;
                story.key = Guid.NewGuid().ToString();
                story.storyPhotos = new List<StoryPhoto>();
                story.accessibility?.ForEach((acc) =>
                {
                    acc.files = new List<AccessibilityFile>();
                    acc.photos?.ForEach((photo) =>
                    {
                        var fileName = _uploadService.SaveFile(photo);
                        acc.files.Add(new AccessibilityFile
                        {
                            accessibilityId = acc.id,
                            userId = acc.userId,
                            fileName = fileName,
                            small = photo.small,
                        });
                    });
                });
                story.photos?.ForEach((photo) =>
                {
                    var fileName = _uploadService.SaveFile(photo);

                    story.storyPhotos.Add(new StoryPhoto
                    {
                        fileName = fileName,
                        small = photo.small,
                        //storyId = story.id,
                    });
                });
                _data.Stories?.Add(story);
                _data.SaveChanges();
                return story;
            });
        }

        public Task Update(Story story)
        {
            return Task.Run(() =>
            {
                var s = _data.Stories.FirstOrDefault(x => x.id == story.id);
                if (s == null) return;
                s.accessibility = story.accessibility;
                s.comments = story.comments;
                s.name = story.name;
                s.startDate = story.startDate;  
                s.title = story.title;
                s.cityId = story.cityId;
                s.countryId = story.countryId;  
                s.estimation = story.estimation;
                _data.SaveChanges();
            });
        }

        public Task<List<Story>> GetAll()
        {
            return Task.Run(() =>
            {
                return _data.Stories.Include(x => x.accessibility).ThenInclude(x => x.accessibilityItems).ToList();
            });
        }

        public Task<List<Story>> GetStories(string q, int type, int userId = 0)
        {
            return Task.Run(() =>
            {
                var res = _data.Stories
                .Where(x => x.storyType == type)
                .Where(x => userId == 0 || x.userId == userId)
                .Where(x => q == "" ||
                (
                       (x.name != null && x.name.Contains(q)))
                    || (x.title != null && x.title.Contains(q))
                    || (x.country != null && x.country.name != null && x.country.name.Contains(q))
                    || (x.city != null && x.city.name != null && x.city.name.Contains(q))
                )
                .OrderByDescending(x => x.estimation).ThenByDescending(x => x.endDate)
                .Include(x => x.user)
                .Include(x => x.city)
                .Include(x => x.country)
                .Include(x => x.storyPhotos)
                .Include(x => x.accessibility).ThenInclude(x => x.accessibilityItems)
                .Include(x => x.accessibility).ThenInclude(x => x.files)
                .ToList();

                res.ForEach(x =>
                {
                    if (x.user != null)
                    {
                        x.user.password = null;
                        x.user.key = null;
                        x.user.stories = null;
                        x.user.role = 0;
                        x.user.mobilities = null;
                        x.user.chairInfo = null;
                        x.user.chairOptions = null;
                    }
                    if (x.storyPhotos != null && x.storyPhotos.Count > 0)
                        x.storyPhotos = new List<StoryPhoto> { x.storyPhotos[0] };
                });

                return res;
            });
        }

        public Story GetStoryById(int id)
        {
            var story = _data.Stories
                .Include(x => x.storyPhotos)
                .Include(x => x.accessibility)
                .Include(x => x.user)
                .Where(x => x.id == id).FirstOrDefault();
            return story;
        }
    }
}
