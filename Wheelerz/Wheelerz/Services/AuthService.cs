using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Wheelerz.Helpers;
using Wheelerz.Models;

#pragma warning disable CS8601
#pragma warning disable CS8604
#pragma warning disable CS8602

namespace Wheelerz.Services
{
    public interface IAuthService
    {
        LoginResponse Registration(RegistrRequest user);
        LoginResponse Login(LoginRequest login);
        User? ValidateUser(string authorization,string lang);
    }

    public class AuthService : IAuthService
    {
        const string KEY = "qw#@eRtBBlhsdfasdfasdfasdfasdfd456asdfasdfasdf65asdfasdfasdf";
        const string USER = "Marat.com";

        private readonly DataContext _data;
        public AuthService(DataContext dataContext)
        {
            _data = dataContext;
        }
        public LoginResponse Login(LoginRequest login)
        {
            if (string.IsNullOrEmpty(login.password) || login.password.Trim() == "") return new LoginResponse() { error = "no_password" };
            if (string.IsNullOrEmpty(login.email) || login.email.Trim() == "") return new LoginResponse() { error = "no_mail" };
            var user = _data.Users?.Where(x => x.email == login.email.Trim().ToLower()).FirstOrDefault();
            if (user == null) return new LoginResponse() { error = "email_not_found" };
            if (user.password != EncryptionHelper.Encrypt(login.password)) return new LoginResponse() { error = "invalid_password" };

            return new LoginResponse()
            {
                key = user.key,
                firstName = user.firstName,
                lastName = user.lastName,
                email = user.email,
                token = GenerateJSONWebToken(user),
                role = user.role,
            };
        }

        private static string GenerateJSONWebToken(User userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                new Claim("phone", userInfo.phone),
                new Claim("firstName", userInfo.lastName),
                new Claim("lastName", userInfo.phone),
                new Claim("id", userInfo.id.ToString()),
            };

            var token = new JwtSecurityToken(USER,
              USER,
              claims,
              expires: DateTime.Now.AddMinutes(120),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public User? ValidateUser(string authorization,string lang)
        {
            if (authorization == null) return null;
            if (lang != "en" && lang != "he") lang = "en";

            var token = new JwtSecurityTokenHandler().ReadJwtToken(authorization);
            var dictionary = token.Claims.ToDictionary(x => x.Type, x => x.Value);
            var id = int.Parse(dictionary["id"]);

            var user = _data.Users?.Where(x => x.id == id).FirstOrDefault();
            user.lang = lang;

            return user;
        }

        public LoginResponse Registration(RegistrRequest registr)
        {
            if (string.IsNullOrEmpty(registr.password) || registr.password.Trim() == "") return new LoginResponse() { error = "no_password" };
            if (string.IsNullOrEmpty(registr.email) || registr.email.Trim() == "") return new LoginResponse() { error = "no_mail" };
            //if (string.IsNullOrEmpty(registr.birthDay)) return new LoginResponse() { error = "no_birthday" };

            var email = registr.email.Trim().ToLower();
            var user = _data.Users?.Where(x => x.email == registr.email).FirstOrDefault();
            if (user != null) return new LoginResponse() { error = "email_already_exists" };

            var newUser = new User()
            {
                email = registr.email,
                key = Guid.NewGuid().ToString(),
                password = EncryptionHelper.Encrypt(registr.password.Trim()),
                phone = registr.phone,
                lastName = registr.lastName,
                firstName = registr.firstName,
                birthDay = DateTime.Now,
                birthYear = registr.birthYear,
                lastVisit = DateTime.Now,
                sex = registr.sex,
                countryId = registr.countryId,
                stateId = registr.stateId,
                registrDate = DateTime.Now,
                role = 0,
            };
            _data.Users?.Add(newUser);
            _data.SaveChanges();
            return new LoginResponse()
            {
                key = newUser.key,
                firstName = newUser.firstName,
                lastName = newUser.lastName,
                email = newUser.email,
                token = GenerateJSONWebToken(newUser),
            };
        }
    }
}
