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
            this._userService = userService;
        }

        [HttpGet]
        public async Task<List<User>> GetUsers()
        {
            return await _userService.GetUsers();
        }

        [HttpGet("my-profile")]
        public async Task<User> GetProfile()
        {
            return await _userService.GetUserProfileAsyns((HttpContext.Items["login"] as User).id);
        }

        [HttpPost("avatar")]
        public string ChangeAvatar(FileImage file)
        {
            return _userService.ChangeAvatar(file, (HttpContext.Items["login"] as User).id);
        }

        [HttpPost("mobility")]
        public async Task UpdateMobility(MobilityDto mobility)
        {
            await _userService.UpdateMobilityAsync((HttpContext.Items["login"] as User).id, mobility.mobilities);
            await _userService.UpdateChairOptionsAsync((HttpContext.Items["login"] as User).id, mobility.chairOptions);
            await _userService.UpdateChairInfoAsync((HttpContext.Items["login"] as User).id, mobility.chairInfo);
        }

        [HttpGet("mobility")]
        public MobilityDto GetMobility()
        {
            var res = new MobilityDto()
            {
                mobilities = _userService.GetMobilities((HttpContext.Items["login"] as User).id),
                chairInfo = _userService.GetChairInfo((HttpContext.Items["login"] as User).id),
                chairOptions = _userService.GetChairOptions((HttpContext.Items["login"] as User).id),
            };
            return res;
        }
    }
}
