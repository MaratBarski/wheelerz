using Microsoft.AspNetCore.Mvc;
using Wheelerz.DTO;
using Wheelerz.Filters;
using Wheelerz.Helpers;
using Wheelerz.Models;
using Wheelerz.Services;

#pragma warning disable CS8602
#pragma warning disable CS8604

namespace Wheelerz.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [AuthFilter]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _userService.GetUsers();
        }

        [HttpPost]
        public async Task<PageResponse<IEnumerable<User>>> SelectUsers(UserSelector request)
        {
            return await _userService.GetUsers(request);
        }

        [HttpGet("my-profile/{id}")]
        public async Task<User> GetProfile(int id)
        {
            return await _userService.GetUserProfileAsyns(id);
        }

        [HttpPost("avatar")]
        public string ChangeAvatar(FileImage file)
        {
            var id = int.Parse(Util.GetQueryParam(Request, "uid", _userService.CurrenUser.id));
            return _userService.ChangeAvatar(file, id);
        }

        [HttpPost("mobility")]
        public async Task UpdateMobility(MobilityDto mobility)
        {
            await _userService.UpdateChairOptionsAsync(_userService.CurrenUser.id, mobility.chairOptions);
            await _userService.UpdateMobilityAsync(_userService.CurrenUser.id, mobility.mobilities);
            await _userService.UpdateChairInfoAsync(_userService.CurrenUser.id, mobility.chairInfo);
        }

        [HttpGet("mobility")]
        public MobilityDto GetMobility()
        {
            var res = new MobilityDto()
            {
                mobilities = _userService.GetMobilities(_userService.CurrenUser.id),
                chairInfo = _userService.GetChairInfo(_userService.CurrenUser.id),
                chairOptions = _userService.GetChairOptions(_userService.CurrenUser.id),
            };
            return res;
        }

        [HttpGet("info/{id}")]
        public User GetInfo(int id)
        {
            return _userService.GetUserInfo(id);
        }

        [HttpPut]
        public void Update(RegistrRequest user)
        {
            _userService.UpdateUserInfo(_userService.CurrenUser.id, user);
        }

        [HttpDelete("{id}")]
        public void DeleteUser(int id)
        {
            _userService.DeleteUser(id);
        }

        [HttpGet("hasmob")]
        public dynamic CheckMobs()
        {
            return new { count = _userService.GetMobilities(_userService.CurrenUser.id).Count() };
        }


    }
}
