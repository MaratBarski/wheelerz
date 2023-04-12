using Microsoft.AspNetCore.Mvc;
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

        private string GetSearchText()
        {
            string q = Request.Query["q"];
            if (String.IsNullOrEmpty(q)) q = "";
            return q.Trim();
        }

        private int GetUserId()
        {
            string u = Request.Query["u"];
            if (String.IsNullOrEmpty(u)) u = "0";
            int id;
            if (int.TryParse(u, out id)) return Math.Max(id, 0);
            return 0;
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

        [HttpGet]
        public async Task<List<Story>> Get()
        {
            return await _storyService.GetAll();
        }

        [HttpGet("trips")]
        public async Task<List<Story>> GetTrips()
        {
            return await _storyService.GetStories(GetSearchText(), 1, GetUserId());
        }

        [HttpGet("hotels")]
        public async Task<List<Story>> GetHotels()
        {
            return await _storyService.GetStories(GetSearchText(), 2, GetUserId());
        }

        [HttpGet("accessibilities")]
        public async Task<List<Story>> GetAccessibilities()
        {
            return await _storyService.GetStories(GetSearchText(), 3, GetUserId());
        }

        [HttpGet("trends")]
        public async Task<List<Story>> GetTrands()
        {
            return await _storyService.GetStories(GetSearchText(), 4, GetUserId());
        }

        [HttpGet("travelers")]
        public async Task<List<Story>> GetTravelers()
        {
            return await _storyService.GetStories(GetSearchText(), 5, GetUserId());
        }

        [HttpGet("{id}")]
        public Story GetStory(int id)
        {
            return  _storyService.GetStoryById(id);
        }

        [HttpPut]
        public async Task Update(Story story)
        {
            await _storyService.Update(_userService.CurrenUser.id,story);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _storyService.Delete(_userService.CurrenUser.id, id);
        }
    }
}
