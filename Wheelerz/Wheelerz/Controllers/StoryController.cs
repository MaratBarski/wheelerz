﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Wheelerz.DTO;
using Wheelerz.Filters;
using Wheelerz.Helpers;
using Wheelerz.Models;
using Wheelerz.Services;

#pragma warning disable CS8602
#pragma warning disable CS8600
#pragma warning disable CS8604 
#pragma warning disable CS8603
#pragma warning disable CS4014

namespace Wheelerz.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [AuthFilter]
    public class StoryController : ControllerBase
    {
        private readonly IStoryService _storyService;
        private readonly IUserService _userService;
        private readonly IHubContext<ChatHub> _chatHub;
        private readonly IChatService _chatService;
        public StoryController(IStoryService storyService, IUserService userService, IHubContext<ChatHub> chatHub, IChatService chatService)
        {
            _storyService = storyService;
            _userService = userService;
            _chatHub = chatHub;
            _chatService = chatService;
        }

        [HttpPost]
        [PermissionFilter(Permissions.AddStory)]
        public async Task<Story> Add(Story story)
        {
            if (story.storyType < 1 || story.storyType > 5) return null;

            story.userId = _userService.CurrentUser.id;
            story.accessibility?.ForEach(x =>
           {
               x.userId = story.userId;
               x.accessibilityItems?.ForEach(y => y.userId = story.userId);
               x.files?.ForEach(z => z.userId = story.userId);
           });

            var res = await _storyService.Add(story);

            _chatService.Send(_userService.CurrentUser.lang, Consts.ADD_STORY, story);

            return res;
        }

        [HttpPost("search")]
        public async Task<PageResponse<IEnumerable<Story>>> GetReview(StoryRequest request)
        {
            await _userService.UpdateLastAccess();
            return await _storyService.GetStories(request);
        }

        [HttpGet("{id}/{withFiles}")]
        public async Task<Story> GetStory(int id, bool withFiles)
        {
            await _userService.UpdateLastAccess();
            return await _storyService.GetStoryById(id, withFiles);
        }

        [HttpGet("story-comments/{id}")]
        public async Task<IEnumerable<StoryComment>> GetStoryComments(int id)
        {
            return await _storyService.GetComments(id);
        }

        [HttpGet("accessibility-files/{id}")]
        public async Task<List<AccessibilityFile>> GetAccessibilityFileFiles(int id)
        {
            return await _storyService.GetAccessibilityFileFiles(id);
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
        [PermissionFilter(Permissions.AddComment)]
        public async Task<List<StoryComment>> AddComment(StoryComment comment)
        {
            await _userService.UpdateLastAccess();
            var story = await _storyService.AddComment(comment);

            if (!Consts.IS_SOCKET_DISABLE)
            {
                _chatService.Send(_userService.CurrentUser.lang, Consts.ADD_COMMENT + "-" + comment.storyId, story.userComments);
                if (story.userId != _userService.CurrentUser.id)
                    _chatService.SendToUser(story.userId, Consts.USER_NEW_COMMENT, comment.storyId);
            }

            return story.userComments;
        }

        [HttpDelete("delete-comment/{id}/{storyId}")]
        public async Task<List<StoryComment>> DeleteComment(int id, int storyId)
        {
            await _userService.UpdateLastAccess();

            _chatService.Send(_userService.CurrentUser.lang, Consts.DELETE_COMMENT + "-" + storyId, id);

            return await _storyService.DeleteComment(id, storyId);
        }

    }
}
