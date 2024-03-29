﻿using Microsoft.EntityFrameworkCore;
using Wheelerz.DTO;
using Wheelerz.Helpers;
using Wheelerz.Models;

#pragma warning disable CS8601 
#pragma warning disable CS8603
#pragma warning disable CS8602
#pragma warning disable CS8604
#pragma warning disable CS8619

namespace Wheelerz.Services
{
    public interface IUserService
    {
        Task UpdateMobilityAsync(int userId, List<UserMobility> mobilities);
        Task<List<User>> GetUsers();
        Task<List<int>> GetUserIds(StorySelector request);
        Task<User> GetUserProfileAsyns(int id);
        string ChangeAvatar(FileImage file, int userId);
        Task<List<UserMobility>> GetMobilities(int userId);
        Task UpdateChairInfoAsync(int userId, ChairInfo info);
        Task UpdateChairOptionsAsync(int userId, List<ChairOption> options);
        Task<ChairInfo> GetChairInfo(int id);
        Task<List<ChairOption>> GetChairOptions(int id);
        Task<PageResponse<IEnumerable<User>>> GetUsers(UserSelector request);
        User GetUserInfo(int id);
        void UpdateUserInfo(int id, RegistrRequest user);
        void DeleteUser(int id);
        User CurrentUser { get; }
        Task UpdateLastAccess();
        bool IsNotValidUser(int id);
        bool IsValidUser(int id);
        Task<ChairInfo> GetCharInfoToCm(int id);

    }
    public class UserService : IUserService
    {
        private readonly DataContext _data;
        private readonly IUploadService _uploadService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public User CurrentUser => _httpContextAccessor.HttpContext.Items["login"] as User;
        public UserService(DataContext data, IUploadService uploadService, IHttpContextAccessor httpContextAccessor)
        {
            _data = data;
            _uploadService = uploadService;
            _httpContextAccessor = httpContextAccessor;
        }

        public Task<List<User>> GetUsers()
        {
            return Task.Run(async () =>
            {
                return await _data.Users.Include(x => x.country)
                .Include(x => x.state)
                .OrderByDescending(x => x.lastVisit)
                .ToListAsync();
            });
        }

        public Task<User> GetUserProfileAsyns(int id)
        {
            if (id == 0) id = CurrentUser.id;
            if (IsNotValidUser(id)) throw new Exception("auth");

            return Task.Run(async () =>
            {
                var user = await _data.Users.Include(x => x.country).Include(x => x.state).FirstOrDefaultAsync(x => x.id == id);
                user.mobilities = await _data.UserMobilities.Where(x => x.userId == id).ToListAsync();
                user.chairInfo = await _data.ChairInfos.FirstOrDefaultAsync(x => x.userId == id);
                user.chairOptions = await _data.ChairOptions.Where(x => x.userId == id).ToListAsync();

                return user;
            });
        }

        public Task<List<UserMobility>> GetMobilities(int userId)
        {
            return Task.Run(async () =>
            {
                return await _data.UserMobilities.Where(x => x.userId == userId).ToListAsync();
            });

        }

        public string ChangeAvatar(FileImage file, int userId)
        {
            if (userId == 0) userId = CurrentUser.id;
            if (IsNotValidUser(userId)) return "";
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
            return Task.Run(async () =>
            {
                var user = await _data.Users.FirstOrDefaultAsync(x => x.id == userId);
                if (user == null) return;

                user.noWalk = mobilities.Any(x => x.noWalk) ? 1 : 0;
                var forRemove = _data.UserMobilities.Where(x => x.userId == userId);
                _data.UserMobilities.RemoveRange(forRemove);
                user.mobilityNumber = 0;

                if (0 == user.noWalk) user.chairNumber = 0;

                mobilities.ForEach(x =>
                {
                    x.userId = userId;
                    user.mobilityNumber += Consts.MobilitiesDictionary[x.name];
                });

                _data.UserMobilities.AddRange(mobilities);
                await _data.SaveChangesAsync();
            });
        }
        public Task UpdateChairInfoAsync(int userId, ChairInfo info)
        {
            return Task.Run(async () =>
            {
                var user = await _data.Users.FirstOrDefaultAsync(x => x.id == userId);
                if (user == null) return;

                var forDelete = await _data.ChairInfos.Where(x => x.userId == userId).FirstOrDefaultAsync();
                if (forDelete != null) _data.ChairInfos.Remove(forDelete);
                info.userId = userId;
                _data.ChairInfos.Add(info);
                await _data.SaveChangesAsync();
            });
        }
        public Task UpdateChairOptionsAsync(int userId, List<ChairOption> options)
        {
            return Task.Run(async () =>
            {
                var user = await _data.Users.FirstOrDefaultAsync(x => x.id == userId);
                if (user == null) return;

                user.chairNumber = 0;
                var forDelete = _data.ChairOptions.Where(x => x.userId == userId);
                _data.ChairOptions.RemoveRange(forDelete);
                options.OrderBy(x => x.key).ToList()
                .ForEach(x =>
                {
                    if (Consts.ChairDictionary.ContainsKey(x.key))
                    {
                        if (Consts.ChairDictionary[x.key].ContainsKey(x.value))
                        {
                            user.chairNumber |= Consts.ChairDictionary[x.key][x.value];
                            x.userId = userId;
                        }
                    }
                });
                _data.ChairOptions.AddRange(options);
                await _data.SaveChangesAsync();
            });
        }

        public Task<ChairInfo> GetChairInfo(int userId)
        {
            return Task.Run(async () =>
            {
                return await _data.ChairInfos.FirstOrDefaultAsync(x => x.userId == userId);
            });
        }

        public Task<List<ChairOption>> GetChairOptions(int userId)
        {
            return Task.Run(async () =>
            {
                return await _data.ChairOptions.Where(x => x.userId == userId).ToListAsync();
            });

        }

        public bool IsNotValidUser(int id)
        {
            return (!CurrentUser.isAdmin && id != CurrentUser.id);
        }

        public bool IsValidUser(int id)
        {
            return !IsNotValidUser(id);
        }
        public User GetUserInfo(int id)
        {
            if (id == 0) id = CurrentUser.id;
            if (IsNotValidUser(id)) return null;
            var user = _data.Users.FirstOrDefault(x => x.id == id);
            user.password = "";
            return user;
        }

        public void UpdateUserInfo(int id, RegistrRequest user)
        {
            var u = _data.Users.FirstOrDefault(u => u.id == id);
            if (u == null) return;
            if (_data.Users.Any(x => x.email == user.email && x.id != id)) return;

            if(u.role == 0 && CurrentUser.isAdmin)
            {
                u.permission = user.permission;
            }

            u.stateId = user.stateId;
            u.countryId = user.countryId;
            u.sex = user.sex;
            u.firstName = user.firstName;
            u.lastName = user.lastName;
            u.email = user.email;
            u.phone = user.phone;
            u.birthYear = user.birthYear;
            u.birthDay = DateTime.Now;
            u.password = EncryptionHelper.Encrypt(user.password.Trim());

            _data.SaveChanges();
        }

        public Task<List<int>> GetUserIds(StorySelector request)
        {
            return Task.Run(async () =>
            {
                var linq = _data.Users.Include(x => x.mobilities).Where(x => x.deleted == 0);
                if (request.isOnlyMy)
                    linq = linq.Where(x => x.id == request.userId);
                else
                    linq = linq.Where(x => request.isMyInclude || x.id != CurrentUser.id);

                var users = await linq.ToListAsync();

                var userIds = new List<int>();

                foreach (var user in users)
                {
                    if (user.mobilities == null) user.mobilities = new List<UserMobility>();

                    bool isContinue = false;
                    foreach (var mobility in user.mobilities)
                    {
                        if (request.mobilities.ContainsKey(mobility.name) && !request.mobilities[mobility.name])
                        {
                            isContinue = true;
                            break;
                        }
                    }

                    foreach (var mob in request.mobilities.Keys)
                    {
                        if (request.mobilities[mob] && !user.mobilities.Any(x => x.name == mob))
                        {
                            isContinue = true;
                            break;
                        }
                        if (!request.mobilities[mob] && user.mobilities.Any(x => x.name == mob))
                        {
                            isContinue = true;
                            break;
                        }
                    }

                    if (isContinue) continue;

                    userIds.Add(user.id);
                }

                return userIds;
            });
        }

        public Task<PageResponse<IEnumerable<User>>> GetUsers(UserSelector request)
        {
            return Task.Run(async () =>
            {
                var linq = _data.Users.Include(x => x.country).Include(x => x.state).Include(x => x.mobilities)
                .Where(x => x.deleted == 0)
                .Where(x => string.IsNullOrEmpty(request.q) ||
                (
                    x.firstName.Contains(request.q) ||
                    x.lastName.Contains(request.q) ||
                    x.email.Contains(request.q)
                 ))
                .OrderByDescending(x => x.lastVisit);

                var total = await linq.AsSplitQuery().CountAsync();
                var res = await linq.Skip(request.page.current * request.page.size).Take(request.page.size)
                .ToListAsync();
                res.ForEach(x =>
                {
                    x.password = "";
                });
                return new PageResponse<IEnumerable<User>>
                {
                    total = total,
                    result = res
                };
            });
        }

        public void DeleteUser(int id)
        {
            if (id == 0) id = CurrentUser.id;
            if (IsNotValidUser(id)) return;

            var user = _data.Users.FirstOrDefault(x => x.id == id);
            if (user == null) return;
            user.deleted = 1;
            _data.SaveChanges();
        }

        public Task UpdateLastAccess()
        {
            return Task.Run(async () =>
            {
                if (CurrentUser == null) return;

                var user = await _data.Users.FirstOrDefaultAsync(x => x.id == CurrentUser.id);
                if (user == null) return;

                user.lastVisit = DateTime.Now;
                CurrentUser.lastVisit = DateTime.Now;
                await _data.SaveChangesAsync();
            });
        }

        public Task<ChairInfo> GetCharInfoToCm(int id)
        {
            return Task.Run(async () =>
            {
                var ci = await _data.ChairInfos.FirstOrDefaultAsync(x => x.userId == id);
                if (ci == null) return new ChairInfo { messure = "cm", width = 0, length = 0, seatHeight = 0 };
                double kf = (ci.messure == "inch") ? 2.54 : 1;
                return new ChairInfo()
                {
                    messure = "cm",
                    length = ci.length * kf,
                    width = ci.width * kf,
                    seatHeight = ci.seatHeight * kf
                };
            });
        }
    }
}
