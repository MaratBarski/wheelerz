using Microsoft.AspNetCore.Mvc;
using Wheelerz.DTO;
using Wheelerz.Filters;
using Wheelerz.Models;
using Wheelerz.Services;

#pragma warning disable CS8602
#pragma warning disable CS8600
#pragma warning disable CS8604 

namespace Wheelerz.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [AuthFilter]
    public class StoryController : ControllerBase
    {
        private readonly IStoryService _storyService;
        private readonly IUserService _userService;
        public StoryController(IStoryService storyService, IUserService userService)
        {
            _storyService = storyService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<Story> Add(Story story)
        {
            if (story.storyType < 1 || story.storyType > 5) throw new ArgumentException();

            story.userId = _userService.CurrenUser.id;
            story.accessibility?.ForEach(x =>
           {
               x.userId = story.userId;
               x.accessibilityItems?.ForEach(y => y.userId = story.userId);
               x.files?.ForEach(z => z.userId = story.userId);
           });

            return await _storyService.Add(story);
        }

        [HttpPost("search")]
        public async Task<PageResponse<IEnumerable<Story>>> GetReview(StoryRequest request)
        {
            await _userService.UpdateLastAccess();
            return await _storyService.GetStories(request);
        }

        [HttpGet("{id}")]
        public async Task<Story> GetStory(int id)
        {
            await _userService.UpdateLastAccess();
            return await _storyService.GetStoryById(id);
        }

        [HttpPut]
        public async Task Update(Story story)
        {
            await _storyService.Update(story);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _userService.UpdateLastAccess();
            await _storyService.Delete(id);
        }

        [HttpPost("select")]
        public async Task<PageResponse<IEnumerable<Story>>> Select(StorySelector storySelector)
        {
            await _userService.UpdateLastAccess();
            return await _storyService.SelectForUser(storySelector);
        }

        [HttpPost("add-comment")]
        public async Task<List<StoryComment>> AddComment(StoryComment comment)
        {
            await _userService.UpdateLastAccess();
            return await _storyService.AddComment(comment);
        }
    }
}
