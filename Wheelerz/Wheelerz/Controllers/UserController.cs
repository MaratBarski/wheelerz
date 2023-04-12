using Microsoft.AspNetCore.Mvc;
using Wheelerz.DTO;
using Wheelerz.Filters;
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
        public async Task<List<User>> GetUsers()
        {
            return await _userService.GetUsers();
        }

        [HttpGet("my-profile")]
        public async Task<User> GetProfile()
        {
            return await _userService.GetUserProfileAsyns(_userService.CurrenUser.id);
        }

        [HttpPost("avatar")]
        public string ChangeAvatar(FileImage file)
        {
            return _userService.ChangeAvatar(file, _userService.CurrenUser.id);
        }

        [HttpPost("mobility")]
        public async Task UpdateMobility(MobilityDto mobility)
        {
            await _userService.UpdateMobilityAsync(_userService.CurrenUser.id, mobility.mobilities);
            await _userService.UpdateChairOptionsAsync(_userService.CurrenUser.id, mobility.chairOptions);
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

        [HttpGet("info")]
        public User GetInfo()
        {
            return _userService.GetUserInfo(_userService.CurrenUser.id);
        }

        [HttpPut]
        public void Update(RegistrRequest user)
        {
            _userService.UpdateUserInfo(_userService.CurrenUser.id, user);
        }
    }
}
