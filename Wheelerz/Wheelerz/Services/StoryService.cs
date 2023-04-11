using Microsoft.EntityFrameworkCore;
using Wheelerz.Helpers;
using Wheelerz.Models;

#pragma warning disable CS8620
namespace Wheelerz.Services
{
    public interface IStoryService
    {
        Task<Story> Add(Story story);
        Task<List<Story>> GetAll();
        Task<List<Story>> GetStories(string q, int type);
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

        public Task<List<Story>> GetAll()
        {
            return Task.Run(() =>
            {
                return _data.Stories.Include(x => x.accessibility).ThenInclude(x => x.accessibilityItems).ToList();
            });
        }

        public Task<List<Story>> GetStories(string q, int type)
        {
            return Task.Run(() =>
            {
                var res = _data.Stories.Where(x => x.storyType == type)
                .Where(x => q == "" || x.name == null || x.name.Contains(q))
                .OrderByDescending(x => x.estimation)
                .Include(x => x.accessibility).ThenInclude(x => x.accessibilityItems)
                .Include(x => x.accessibility).ThenInclude(x => x.files)
                .Include(x => x.storyPhotos)
                .ToList();

                res.ForEach(x =>
                {
                    if (x.user != null)
                    {
                        x.user.password = null;
                        x.user.key = null;
                    }
                    if(x.storyPhotos != null && x.storyPhotos.Count> 0)
                        x.storyPhotos = new List<StoryPhoto> { x.storyPhotos[0] };
                });

                return res;
            });
        }
    }
}
