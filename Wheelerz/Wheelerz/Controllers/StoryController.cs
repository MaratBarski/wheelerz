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
        public StoryController(IStoryService storyService)
        {
            _storyService = storyService;
        }

        private string GetSearchText()
        {
            string q = Request.Query["q"];
            if (String.IsNullOrEmpty(q)) q = "";
            return q.Trim();
        }

        [HttpPost]
        public async Task<Story> Add(Story story)
        {
            if (story.storyType < 1 || story.storyType > 5) throw new ArgumentException();

            story.userId = (HttpContext.Items["login"] as User).id;
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
            return await _storyService.GetStories(GetSearchText(), 1);
        }

        [HttpGet("hotels")]
        public async Task<List<Story>> GetHotels()
        {
            return await _storyService.GetStories(GetSearchText(), 2);
        }

        [HttpGet("accessibilities")]
        public async Task<List<Story>> GetAccessibilities()
        {
            return await _storyService.GetStories(GetSearchText(), 3);
        }

        [HttpGet("trends")]
        public async Task<List<Story>> GetTrands()
        {
            return await _storyService.GetStories(GetSearchText(), 4);
        }

        [HttpGet("travelers")]
        public async Task<List<Story>> GetTravelers()
        {
            return await _storyService.GetStories(GetSearchText(), 5);
        }

    }
}
