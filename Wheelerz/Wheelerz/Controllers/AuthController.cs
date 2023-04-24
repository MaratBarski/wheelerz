using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wheelerz.DTO;
using Wheelerz.Models;
using Wheelerz.Services;

namespace Wheelerz.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public LoginResponse Login(LoginRequest login)
        {
            return _authService.Login(login);
        }

        [HttpPost("registr")]
        public LoginResponse Registr(RegistrRequest user)
        {
            return _authService.Registration(user);
        }

        [HttpPost("change-password")]
        public async Task<ChangePasswordResponse> ChangePassword(ChangePassword pwd)
        {
            return await _authService.ChangePassword(pwd);
        }
    }
}
