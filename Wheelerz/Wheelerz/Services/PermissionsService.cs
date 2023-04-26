using Wheelerz.Helpers;
using Wheelerz.Models;

namespace Wheelerz.Services
{
    public interface IPermissionsService
    {
        public bool HasPermission(User user, Permissions perm);
    }
    public class PermissionsService : IPermissionsService
    {
        public bool HasPermission(User user, Permissions permission)
        {
            if (user.permission == 0) return true;
            return (user.permission & (int)permission) != 0;
        }
    }
}
