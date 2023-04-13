﻿using Microsoft.EntityFrameworkCore;
using Wheelerz.Helpers;
using Wheelerz.Models;

#pragma warning disable CS8601 
#pragma warning disable CS8603
#pragma warning disable CS8602
#pragma warning disable CS8604

namespace Wheelerz.Services
{
    public interface IUserService
    {
        Task UpdateMobilityAsync(int userId, List<UserMobility> mobilities);
        Task<List<User>> GetUsers();
        Task<User> GetUserProfileAsyns(int id);
        string ChangeAvatar(FileImage file, int userId);
        List<UserMobility> GetMobilities(int userId);
        Task UpdateChairInfoAsync(int userId, ChairInfo info);
        Task UpdateChairOptionsAsync(int userId, List<ChairOption> options);
        ChairInfo GetChairInfo(int id);
        List<ChairOption> GetChairOptions(int id);
        User GetUserInfo(int id);
        void UpdateUserInfo(int id, RegistrRequest user);
        User CurrenUser { get; }
    }
    public class UserService : IUserService
    {
        private readonly DataContext _data;
        private readonly IUploadService _uploadService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public User CurrenUser => _httpContextAccessor.HttpContext.Items["login"] as User;
        public UserService(DataContext data, IUploadService uploadService, IHttpContextAccessor httpContextAccessor)
        {
            _data = data;
            _uploadService = uploadService;
            _httpContextAccessor = httpContextAccessor;
        }

        public Task<List<User>> GetUsers()
        {
            return Task.Run(() =>
            {
                return _data.Users.Include(x => x.country).Include(x => x.state).ToList();
            });
        }

        public Task<User> GetUserProfileAsyns(int id)
        {
            return Task.Run(() =>
            {
                var user = _data.Users
                .Include(x => x.country)
                .Include(x => x.state)
                .FirstOrDefault(x => x.id == id);
                user.stories = (from s in _data.Stories
                                where s.userId == id && s.deleted == 0
                                select new Story
                                {
                                    id = s.id,
                                    name = s.name,
                                    title = s.title,
                                    storyType = s.storyType,
                                    storyPhotos = s.storyPhotos,
                                    accessibility = s.accessibility,
                                    estimation = s.estimation, 
                                    city = s.city,
                                    country = s.country,
                                    startDate = s.startDate,
                                    endDate = s.endDate,
                                    dateAdd = s.dateAdd,
                                    user = new User()
                                    {
                                        avatar = user.avatar
                                    }
                                }).ToList();
                user.mobilities = _data.UserMobilities.Where(x => x.userId == id).ToList();
                user.chairInfo = _data.ChairInfos.FirstOrDefault(x => x.userId == id);
                user.chairOptions = _data.ChairOptions.Where(x => x.userId == id).ToList();

                return user;
            });
        }

        public List<UserMobility> GetMobilities(int userId)
        {
            return _data.UserMobilities.Where(x => x.userId == userId).ToList();
        }

        public string ChangeAvatar(FileImage file, int userId)
        {
            var user = _data.Users.FirstOrDefault(x => x.id == userId);
            if (user == null) return null;
            if (!string.IsNullOrEmpty(user.avatar)) _uploadService.DeleteFile(user.avatar);

            var fileName = _uploadService.SaveFile(file);
            user.avatar = fileName;
            _data.SaveChanges();
            return user.avatar;
        }
        public Task UpdateMobilityAsync(int userId, List<UserMobility> mobilities)
        {
            return Task.Run(() =>
            {
                var user = _data.Users.FirstOrDefault(x => x.id == userId);
                if (user == null) return;

                user.noWalk = mobilities.Any(x => x.noWalk) ? 1 : 0;
                var forRemove = _data.UserMobilities.Where(x => x.userId == userId);
                _data.UserMobilities.RemoveRange(forRemove);
                mobilities.ForEach(x => x.userId = userId);
                _data.UserMobilities.AddRange(mobilities);
                _data.SaveChanges();
            });
        }

        public Task UpdateChairInfoAsync(int userId, ChairInfo info)
        {
            return Task.Run(() =>
            {
                var user = _data.Users.FirstOrDefault(x => x.id == userId);
                if (user == null) return;

                var forDelete = _data.ChairInfos.Where(x => x.userId == userId).FirstOrDefault();
                if (forDelete != null) _data.ChairInfos.Remove(forDelete);
                info.userId = userId;
                _data.ChairInfos.Add(info);
                _data.SaveChanges();
            });
        }
        public Task UpdateChairOptionsAsync(int userId, List<ChairOption> options)
        {
            return Task.Run(() =>
            {
                var user = _data.Users.FirstOrDefault(x => x.id == userId);
                if (user == null) return;

                var forDelete = _data.ChairOptions.Where(x => x.userId == userId);
                _data.ChairOptions.RemoveRange(forDelete);
                options.ForEach(x => { x.userId = userId; });
                _data.ChairOptions.AddRange(options);
                _data.SaveChanges();
            });
        }

        public ChairInfo GetChairInfo(int userId)
        {
            return _data.ChairInfos.FirstOrDefault(x => x.userId == userId);
        }

        public List<ChairOption> GetChairOptions(int userId)
        {
            return _data.ChairOptions.Where(x=>x.userId == userId).ToList();
        }

        public User GetUserInfo(int id)
        {
            var user = _data.Users.FirstOrDefault(x => x.id == id);
            return user;
        }

        public void UpdateUserInfo(int id, RegistrRequest user)
        {
            var u = _data.Users.FirstOrDefault(u => u.id == id);
            if (u == null) return;
            if (_data.Users.Any(x => x.email == user.email && x.id != id)) return;

            u.stateId = user.stateId;
            u.countryId = user.countryId;
            u.sex = user.sex;
            u.firstName = user.firstName;
            u.lastName = user.lastName;
            u.email = user.email;
            u.phone = user.phone;
            u.birthDay = Util.ParseDate(user.birthDayDisplay, u.birthDay);
            u.password = EncryptionHelper.Encrypt(user.password.Trim());

            _data.SaveChanges();
        }
    }
}