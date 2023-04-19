using Microsoft.EntityFrameworkCore;
using Wheelerz.DTO;
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
        Task<PageResponse<IEnumerable<Story>>> GetStories(StoryRequest request);
        Task<Story> GetStoryById(int id);
        Task Update(Story story);
        Task Delete(int storyId);
        Task<PageResponse<IEnumerable<Story>>> Select(StorySelector storySelector);
    }
    public class StoryService : IStoryService
    {
        private readonly DataContext _data;
        private readonly IUploadService _uploadService;
        private readonly IUserService _userService;
        public StoryService(DataContext data, IUploadService uploadService, IUserService userService)
        {
            _data = data;
            _uploadService = uploadService;
            _userService = userService;
        }

        public Task<Story> Add(Story story)
        {
            return Task.Run(async () =>
            {
                story.lang = _userService.CurrenUser.lang;
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

        public Task Update(Story story)
        {
            return Task.Run(async () =>
            {
                var s = await _data.Stories.Include(x => x.storyPhotos)
                .FirstOrDefaultAsync(x => x.id == story.id && (_userService.CurrenUser.isAdmin || x.userId == _userService.CurrenUser.id));

                if (s == null) return;

                if (story.photos == null) story.photos = new List<FileImage>();
                if (s.storyPhotos == null) s.storyPhotos = new List<StoryPhoto>();

                s.lang = _userService.CurrenUser.lang;

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

        public Task<PageResponse<IEnumerable<Story>>> GetStories(StoryRequest request)
        {
            var linq = _data.Stories
                .Include(x => x.user)
                .Include(x => x.city)
                .Include(x => x.country)
                //.Include(x => x.storyPhotos)
                //.Include(x => x.accessibility).ThenInclude(x => x.accessibilityItems)
                //.Include(x => x.accessibility).ThenInclude(x => x.files)
                .Where(x => x.deleted == 0)
                .Where(x => x.lang == _userService.CurrenUser.lang)
                .Where(x => request.type == 0 || x.storyType == request.type)
                .Where(x => request.userId == 0 || x.userId == request.userId)
                .Where(x => string.IsNullOrEmpty(request.q) ||
                (
                   // (x.name != null && x.name == request.q)
                   //|| (x.title != null && x.title == request.q)
                   //|| (x.country != null && x.country.name != null && x.country.name == request.q)
                   //|| (x.city != null && x.city.name != null && x.city.name == request.q)
                   (x.name != null && x.name.Contains(request.q))
                || (x.title != null && x.title.Contains(request.q))
                || (x.country != null && x.country.name != null && x.country.name.Contains(request.q))
                || (x.city != null && x.city.name != null && x.city.name.Contains(request.q))
                ));
            return Task.Run(async () =>
            {
                var total = await linq.AsSplitQuery().CountAsync();
                var list = await linq
                    .OrderByDescending(x => x.dateAdd).ThenByDescending(x => x.endDate)
                    .Skip(request.page.current * request.page.size)
                    .Take(request.page.size)
                    .ToListAsync();

                list.ForEach(x =>
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

                return new PageResponse<IEnumerable<Story>>
                {
                    total = total,
                    result = list
                };
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

        public Task Delete(int storyId)
        {
            return Task.Run(async () =>
            {
                var story = _data.Stories.FirstOrDefault(x => x.id == storyId && (_userService.CurrenUser.isAdmin || x.userId == _userService.CurrenUser.id));
                if (story == null) return;
                story.deleted = 1;
                await _data.SaveChangesAsync();
            });
        }

        public Task<PageResponse<IEnumerable<Story>>> Select(StorySelector request)
        {
            return Task.Run(async () =>
            {
                var userIds = await _userService.GetUserIds(request);
                var linq = _data.Stories
                    .Include(x => x.user)
                    .Include(x => x.city)
                    .Include(x => x.country)
                    .Where(x => x.deleted == 0)
                    .Where(x => x.lang == _userService.CurrenUser.lang)
                    .Where(x => request.type == 0 || x.storyType == request.type)
                    .Where(x => request.userId == 0 || x.userId == request.userId)
                    .Where(x =>
                           (request.countryId == 0 || x.countryId == request.countryId)
                        && (request.cityId == 0 || x.cityId == request.cityId)
                    )
                    .Where(x => userIds.Contains(x.userId));

                var total = await linq.AsSplitQuery().CountAsync();
                var list = await linq
                    .OrderByDescending(x => x.dateAdd).ThenByDescending(x => x.endDate)
                    .Skip(request.page.current * request.page.size)
                    .Take(request.page.size)
                    .ToListAsync();

                list.ForEach(x =>
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

                return new PageResponse<IEnumerable<Story>>
                {
                    total = total,
                    result = list
                };
            });
        }
    }
}
