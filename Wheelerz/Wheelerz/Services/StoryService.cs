using Microsoft.EntityFrameworkCore;
using Wheelerz.DTO;
using Wheelerz.Helpers;
using Wheelerz.Models;

#pragma warning disable CS8620
#pragma warning disable CS8602
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
        Task<List<int>> GetStoryIds(StorySelector request);
        Task<PageResponse<IEnumerable<Story>>> Select(StorySelector storySelector);
        Task<PageResponse<IEnumerable<Story>>> SelectForUser(StorySelector storySelector);
        Task<List<StoryComment>> AddComment(StoryComment comment);
        Task<List<StoryComment>> DeleteComment(int comment,int storyId);
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

        private bool UpdateAndValidate(Story story)
        {
            if (!string.IsNullOrEmpty(story.mail)) story.mail = story.mail.Trim();
            if (!string.IsNullOrEmpty(story.name)) story.name = story.name.Trim();
            if (!string.IsNullOrEmpty(story.title)) story.title = story.title.Trim();
            if (!string.IsNullOrEmpty(story.link)) story.link = story.link.Trim();
            if (!string.IsNullOrEmpty(story.address)) story.address = story.address.Trim();
            if (!string.IsNullOrEmpty(story.phone)) story.phone = story.phone.Trim();

            if (story.storyType == 2 && string.IsNullOrEmpty(story.name)) return false;
            if (story.storyType != 2 && string.IsNullOrEmpty(story.title)) return false;
            if (story.cityId == 0) return false;
            if (story.countryId == 0) return false;
            if (story.estimation == 0) return false;

            return true;
        }

        public Task<Story> Add(Story story)
        {
            return Task.Run(async () =>
            {
                if (!this.UpdateAndValidate(story)) return null;

                story.lang = _userService.CurrentUser.lang;
                var ci = await _userService.GetCharInfoToCm(_userService.CurrentUser.id);
                story.width = ci.width;
                story.height = ci.seatHeight;
                story.length = ci.length;

                story.mobilityNumber = _userService.CurrentUser.mobilityNumber;
                story.chairNumber = _userService.CurrentUser.chairNumber;

                story.dateAdd = DateTime.Now;
                story.key = Guid.NewGuid().ToString();
                story.storyPhotos = new List<StoryPhoto>();
                story.startDate = Util.ParseDate(story.startDateDisplay, story.startDate);
                story.endDate = Util.ParseDate(story.endDateDisplay, story.endDate);
                story.mobilities = await (from m in _data.UserMobilities.Where(x => x.userId == _userService.CurrentUser.id)
                                          select new StoryMobility()
                                          {
                                              name = m.name
                                          }).ToListAsync();

                if (_userService.CurrentUser.noWalk == 1)
                    story.chairInfo = await (from m in _data.ChairInfos.Where(x => x.userId == _userService.CurrentUser.id)
                                             select new ChairStoryInfo()
                                             {
                                                 length = m.length,
                                                 messure = m.messure,
                                                 seatHeight = m.seatHeight,
                                                 width = m.width,
                                             }).FirstOrDefaultAsync();

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
                story.mainImage = story.storyPhotos?.FirstOrDefault()?.fileName;

                if (!string.IsNullOrEmpty(story.mapStr))
                    story.map = _uploadService.SaveFile(story.mapStr);

                _data.Stories?.Add(story);
                await _data.SaveChangesAsync();
                return story;
            });
        }

        public Task Update(Story story)
        {
            return Task.Run(async () =>
            {
                if (!this.UpdateAndValidate(story)) return;

                var s = await _data.Stories
                .Include(x => x.storyPhotos)
                .Include(x => x.accessibility).ThenInclude(x => x.accessibilityItems)
                .Include(x => x.accessibility).ThenInclude(x => x.files)
                .Include(x => x.accessibility).ThenInclude(x => x.files)
                .FirstOrDefaultAsync(x => x.id == story.id && (_userService.CurrentUser.isAdmin || x.userId == _userService.CurrentUser.id));

                if (s == null) return;

                story.accessibility?.ForEach(ac =>
                {
                    if (ac.files == null) ac.files = new List<AccessibilityFile>();
                    ac.files.ForEach(f =>
                    {
                        if (!ac.photos.Any(x => x.fileName == f.fileName)) _uploadService.DeleteFile(f.fileName);
                    });
                    ac.files = new List<AccessibilityFile>();
                    ac.photos?.ForEach(photo =>
                    {
                        ac.files.Add(new AccessibilityFile
                        {
                            userId = _userService.CurrentUser.id,
                            fileName = string.IsNullOrEmpty(photo.fileName) ? _uploadService.SaveFile(photo) : photo.fileName
                        });
                    });
                });

                if (story.photos == null) story.photos = new List<FileImage>();
                if (s.storyPhotos == null) s.storyPhotos = new List<StoryPhoto>();

                s.lang = _userService.CurrentUser.lang;

                s.storyPhotos.ForEach((photo) =>
                {
                    if (!story.photos.Any(x => x.id == photo.id))
                    {
                        _data.StoryPhotos.Remove(photo);
                        _uploadService.DeleteFile(photo.fileName);
                    }
                });

                s.mainImage = "";
                story.photos.ForEach((photo) =>
                {
                    if (string.IsNullOrEmpty(s.mainImage)) s.mainImage = photo.fileName;
                    if (photo.id != 0) return;

                    var fileName = _uploadService.SaveFile(photo);
                    if (string.IsNullOrEmpty(s.mainImage)) s.mainImage = fileName;

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
                s.phone = story.phone;
                s.link = story.link;
                s.address = story.address;
                s.mail = story.mail;
                s.startDate = Util.ParseDate(story.startDateDisplay, story.startDate);
                s.endDate = Util.ParseDate(story.endDateDisplay, story.endDate);

                if (!string.IsNullOrEmpty(story.mapStr))
                {
                    if (string.IsNullOrEmpty(s.map)) _uploadService.DeleteFile(s.map);

                    s.map = _uploadService.SaveFile(story.mapStr);
                }

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
                .Where(x => x.lang == _userService.CurrentUser.lang)
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
                            .Include(x => x.mobilities)
                            .Include(x => x.chairInfo)
                            .Include(x => x.country)
                            .Include(x => x.city)
                            .Include(x => x.user).ThenInclude(x => x.mobilities)
                            .Include(x => x.user).ThenInclude(x => x.country)
                            .Include(x => x.user).ThenInclude(x => x.state)
                            .Include(x => x.userComments).ThenInclude(x => x.user)
                            .Include(x => x.user).ThenInclude(x => x.chairInfo)
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
                                       userComments = (from c in s.userComments
                                                       select new StoryComment
                                                       {
                                                           isMy = c.userId == _userService.CurrentUser.id,
                                                           text = c.text,
                                                           id = c.id,
                                                           dateAdd = c.dateAdd,
                                                           user = c.user ?? new User
                                                           {
                                                               avatar = c.user.avatar,
                                                               id = c.user.id,
                                                               firstName = c.user.firstName,
                                                               lastName = c.user.lastName
                                                           }
                                                       }).ToList(),
                                       chairInfo = s.chairInfo,
                                       mobilities = s.mobilities,
                                       phone = s.phone,
                                       address = s.address,
                                       mail = s.mail,
                                       link = s.link,
                                       map = s.map,
                                       name = s.name,
                                       title = s.title,
                                       mobilityNumber = s.mobilityNumber,
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
                var story = _data.Stories.FirstOrDefault(x => x.id == storyId && (_userService.CurrentUser.isAdmin || x.userId == _userService.CurrentUser.id));
                if (story == null) return;
                story.deleted = 1;
                await _data.SaveChangesAsync();
            });
        }

        public Task<List<int>> GetStoryIds(StorySelector request)
        {
            return Task.Run(async () =>
            {
                var mobilities = await _data.StoryMobilities.GroupBy(x => x.storyId, y => y.name).ToListAsync();
                var ids = new List<int>();

                foreach (var m in mobilities)
                {
                    bool isContinue = false;
                    foreach (var mobility in m)
                    {
                        if (request.mobilities.ContainsKey(mobility) && !request.mobilities[mobility])
                        {
                            isContinue = true;
                            break;
                        }
                    }
                    if (isContinue) continue;
                    foreach (var mob in request.mobilities.Keys)
                    {
                        if (request.mobilities[mob] && !m.Any(x => x == mob))
                        {
                            isContinue = true;
                            break;
                        }
                        if (!request.mobilities[mob] && m.Any(x => x == mob))
                        {
                            isContinue = true;
                            break;
                        }
                    }

                    if (isContinue) continue;

                    ids.Add(m.Key);
                }
                return ids;
            });
        }

        public Task<PageResponse<IEnumerable<Story>>> Select(StorySelector request)
        {
            return Task.Run(async () =>
            {
                var ids = request.byStoryMob ? await GetStoryIds(request) : await _userService.GetUserIds(request);
                var linq = _data.Stories
                    .Include(x => x.user)
                    .Include(x => x.city)
                    .Include(x => x.country)
                    .Include(x => x.mobilities)
                    .Where(x => x.deleted == 0)
                    .Where(x => x.lang == _userService.CurrentUser.lang)
                    .Where(x => request.type == 0 || x.storyType == request.type)
                    .Where(x => request.userId == 0 || x.userId == request.userId)
                    .Where(x =>
                           (request.countryId == 0 || x.countryId == request.countryId)
                        && (request.cityId == 0 || x.cityId == request.cityId)
                    )
                    .Where(x => request.byStoryMob ? ids.Contains(x.id) : ids.Contains(x.userId));

                if (!string.IsNullOrEmpty(request.q))
                    linq = linq.Where(x => string.IsNullOrEmpty(request.q) ||
               (
                  (x.name != null && x.name.Contains(request.q))
                   || (x.title != null && x.title.Contains(request.q))
                   || (x.country != null && x.country.name != null && x.country.name.Contains(request.q))
                   || (x.city != null && x.city.name != null && x.city.name.Contains(request.q))
               ));

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

        public Task<PageResponse<IEnumerable<Story>>> SelectForUser(StorySelector request)
        {
            return Task.Run(async () =>
            {
                var linq = _data.Stories
                    .Include(x => x.user)
                    .Include(x => x.city)
                    .Include(x => x.country)
                    .Include(x => x.mobilities)
                    .Where(x => x.deleted == 0)
                    .Where(x => x.lang == _userService.CurrentUser.lang)
                    .Where(x => x.storyType == request.type || request.type == 0)
                    .Where(x => request.userId == 0 || (x.userId == request.userId && request.isOnlyMy))
                    .Where(x =>
                           (request.countryId == 0 || x.countryId == request.countryId)
                        && (request.cityId == 0 || x.cityId == request.cityId)
                    );

                if (!string.IsNullOrEmpty(request.q))
                    linq = linq.Where(x => string.IsNullOrEmpty(request.q) ||
               (
                  (x.name != null && x.name.Contains(request.q))
                   || (x.title != null && x.title.Contains(request.q))
                   || (x.country != null && x.country.name != null && x.country.name.Contains(request.q))
                   || (x.city != null && x.city.name != null && x.city.name.Contains(request.q))
               ));

                var total = await linq.AsSplitQuery().CountAsync();
                var ci = await _userService.GetCharInfoToCm(_userService.CurrentUser.id);
                var list = await linq
                    .OrderBy(x => ci.width > x.width ? 1 : -1)
                    .ThenBy(x => ci.length > x.length ? 1 : -1)
                    .ThenBy(x => ci.seatHeight > x.height ? 1 : -1)
                    .ThenByDescending(x => x.chairNumber == _userService.CurrentUser.chairNumber ? 1 : 0)
                    .ThenByDescending(x => x.chairNumber & _userService.CurrentUser.chairNumber)
                    .ThenBy(x => x.chairNumber | _userService.CurrentUser.chairNumber)
                    .ThenByDescending(x => x.mobilityNumber & _userService.CurrentUser.mobilityNumber)
                    .ThenBy(x => Math.Abs(x.mobilityNumber - _userService.CurrentUser.mobilityNumber))
                    .ThenByDescending(x => x.estimation)
                    .ThenByDescending(x => x.dateAdd)
                    .ThenByDescending(x => x.endDate)
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
                });

                return new PageResponse<IEnumerable<Story>>
                {
                    total = total,
                    result = list
                };
            });
        }

        public Task<List<StoryComment>> AddComment(StoryComment comment)
        {
            return Task.Run(async () =>
            {
                var story = await _data.States.FirstOrDefaultAsync(x => x.id == comment.storyId);
                if (story != null)
                {
                    comment.userId = _userService.CurrentUser.id;
                    comment.dateAdd = DateTime.Now;
                    _data.StoryComments.Add(comment);
                    await _data.SaveChangesAsync();
                }
                var s = await GetStoryById(comment.storyId);
                return s.userComments;
            });
        }

        public Task<List<StoryComment>> DeleteComment(int id,int storyId)
        {
            return Task.Run(async () =>
            {
                var comment = await _data.StoryComments.FirstOrDefaultAsync(x => x.id == id);
                if (comment != null)
                {
                    if (_userService.IsValidUser(comment.userId))
                    {
                        _data.StoryComments.Remove(comment);
                        await _data.SaveChangesAsync();
                    }
                }
                var s = await GetStoryById(storyId);
                return s.userComments;
            });
        }
    }
}
