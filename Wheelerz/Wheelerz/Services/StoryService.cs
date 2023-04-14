using Microsoft.EntityFrameworkCore;
using Wheelerz.Helpers;
using Wheelerz.Models;

#pragma warning disable CS8620
#pragma warning disable CS8603
#pragma warning disable CS8604
#pragma warning disable CS8619

namespace Wheelerz.Services
{
    public interface IStoryService
    {
        Task<Story> Add(Story story);
        Task<List<Story>> GetAll();
        Task<List<Story>> GetStories(string q, int type, int userId = 0);
        Task<Story> GetStoryById(int id);
        Task Update(int userId, Story story);
        Task Delete(int userId, int storyId);
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
            return Task.Run(async () =>
            {
                story.dateAdd = DateTime.Now;
                story.key = Guid.NewGuid().ToString();
                story.storyPhotos = new List<StoryPhoto>();
                story.startDate = Util.ParseDate(story.startDateDisplay, story.startDate);
                story.endDate = Util.ParseDate(story.endDateDisplay, story.endDate);

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
                await _data.SaveChangesAsync();
                return story;
            });
        }

        public Task Update(int userId, Story story)
        {
            return Task.Run(async () =>
            {
                var s = await _data.Stories.Include(x => x.storyPhotos).FirstOrDefaultAsync(x => x.id == story.id && x.userId == userId);

                if (s == null) return;

                if (story.photos == null) story.photos = new List<FileImage>();
                if (s.storyPhotos == null) s.storyPhotos = new List<StoryPhoto>();

                s.storyPhotos.ForEach((photo) =>
                {
                    if (!story.photos.Any(x => x.id == photo.id))
                    {
                        _data.StoryPhotos.Remove(photo);
                        _uploadService.DeleteFile(photo.fileName);
                    }
                });

                story.photos.ForEach((photo) =>
                {
                    if (photo.id != 0) return;

                    var fileName = _uploadService.SaveFile(photo);

                    s.storyPhotos.Add(new StoryPhoto
                    {
                        fileName = fileName,
                        small = photo.small,
                    });
                });

                s.accessibility = story.accessibility;
                s.comments = story.comments;
                s.name = story.name;
                s.title = story.title;
                s.cityId = story.cityId;
                s.countryId = story.countryId;
                s.estimation = story.estimation;
                s.startDate = Util.ParseDate(story.startDateDisplay, story.startDate);
                s.endDate = Util.ParseDate(story.endDateDisplay, story.endDate);

                await _data.SaveChangesAsync();
            });
        }

        public Task<List<Story>> GetAll()
        {
            return Task.Run(async () =>
            {
                return await _data.Stories.Include(x => x.accessibility).ThenInclude(x => x.accessibilityItems).ToListAsync();
            });
        }

        public Task<List<Story>> GetStories(string q, int type, int userId = 0)
        {
            return Task.Run(async () =>
            {
                var res = await _data.Stories
                .Where(x => x.deleted == 0)
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
                //.Include(x => x.storyPhotos)
                //.Include(x => x.accessibility).ThenInclude(x => x.accessibilityItems)
                //.Include(x => x.accessibility).ThenInclude(x => x.files)
                .ToListAsync();

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

        public Task<Story> GetStoryById(int id)
        {
            return Task.Run(async () =>
            {
                var story = await (from s in _data.Stories
                            .Include(x => x.storyPhotos)
                            .Include(x => x.accessibility).ThenInclude(x => x.accessibilityItems)
                            .Include(x => x.accessibility).ThenInclude(x => x.files)
                            .Include(x => x.country)
                            .Include(x => x.city)
                            .Include(x => x.user).ThenInclude(x => x.mobilities)
                            .Include(x => x.user).ThenInclude(x => x.country)
                            .Include(x => x.user).ThenInclude(x => x.state)
                             where s.id == id && s.deleted == 0
                             select new Story
                             {
                                 storyPhotos = (from p in s.storyPhotos
                                                select new StoryPhoto
                                                {
                                                    id = p.id,
                                                    fileName = p.fileName,
                                                    small = ""
                                                }).ToList(),
                                 name = s.name,
                                 title = s.title,
                                 countryId = s.countryId,
                                 cityId = s.cityId,
                                 country = s.country,
                                 comments = s.comments,
                                 estimation = s.estimation,
                                 city = s.city,
                                 user = s.user,
                                 startDate = s.startDate,
                                 endDate = s.endDate,
                                 dateAdd = s.dateAdd,
                                 id = s.id,
                                 storyType = s.storyType,
                                 key = s.key,
                                 accessibility = (from a in s.accessibility
                                                  select new Accessibility
                                                  {
                                                      files = (from f in a.files
                                                               select new AccessibilityFile
                                                               {
                                                                   fileName = f.fileName,
                                                                   id = f.id,
                                                               }).ToList(),
                                                      accessibilityItems = a.accessibilityItems,
                                                      name = a.name,
                                                      comments = a.comments,
                                                      id = a.id,
                                                      key = a.key,
                                                  }).ToList()
                             }).FirstOrDefaultAsync();
                return story;
            });
        }

        public Task Delete(int userId, int storyId)
        {
            return Task.Run(async () =>
            {
                var story = _data.Stories.FirstOrDefault(x => x.id == storyId && x.userId == userId);
                if (story == null) return;
                story.deleted = 1;
                await _data.SaveChangesAsync();
            });
        }
    }
}
