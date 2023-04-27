using Microsoft.AspNetCore.SignalR;
using Wheelerz.Helpers;
using Wheelerz.Models;

#pragma warning disable CS8604
#pragma warning disable CS0162

namespace Wheelerz.Services
{
    public delegate void SendToGroupDelegate(string lang, string group, object message, bool sendToAll = false);
    public delegate void SendToUserDelegate(int userId, string group, object message);
    public interface IChatService
    {
        void AddUser(User user);
        void RemoveUser(string connectionId);
        void AddToGroup(string group, string connectionId);
        void RemoveFromGroup(string group, string connectionId);
        void Send(string lang, string group, object message, bool sendToAll = false);
        void SendToUser(int userId, string group, object message);
    }
    public class ChatService : IChatService
    {
        private List<User> _users = new();
        private Object _lock = new();

        private event SendToGroupDelegate _onSendToGroup;
        private event SendToUserDelegate _onSendToUser;

        public ChatService()
        {
            _onSendToGroup += ChatService_onSendToGroup;
            _onSendToUser += ChatService__onSendToUser;
        }

        private void ChatService__onSendToUser(int userId, string group, object message)
        {
            SendToSpecUser(userId, group, message);
        }

        private void ChatService_onSendToGroup(string lang, string group, object message, bool sendToAll = false)
        {
            SendToGroup(lang, group, message, sendToAll);
        }

        public void Send(string lang, string group, object message, bool sendToAll = false)
        {
            if (Consts.IS_SOCKET_DISABLE) return;

            _onSendToGroup(lang, group, message, sendToAll);
        }
        public void SendToUser(int userId, string group, object message)
        {
            if (Consts.IS_SOCKET_DISABLE) return;

            _onSendToUser(userId, group, message);
        }
        private async void SendToGroup(string lang, string group, object message, bool sendToAll = false)
        {
            if (Consts.IS_SOCKET_DISABLE) return;
            try
            {
                var users = _users.Where(x => x.lang == lang && sendToAll || (x.groups != null && x.groups.Contains(group))).ToList();
                foreach (var us in users)
                {
                    try
                    {
                        await us.socket.SendAsync("message", new { room = group, data = message });
                    }
                    catch { }
                }
            }
            catch { }
        }

        private async void SendToSpecUser(int userId,string group,object message)
        {
            if (Consts.IS_SOCKET_DISABLE) return;
            try
            {
                var users = _users.Where(x => x.id == userId).ToList();
                foreach(var user in users)
                {
                    try
                    {
                        await user.socket.SendAsync("notification", new { room = group, data = message });
                    }
                    catch { }
                }    
                    
            }
            catch { }
        }

        public void AddToGroup(string group, string connectionId)
        {
            if (Consts.IS_SOCKET_DISABLE) return;

            var us = _users.FirstOrDefault(x => x.connectionId == connectionId);
            if (us == null) return;
            if (us.groups == null) us.groups = new HashSet<string>();
            if (us.groups.Contains(group)) return;
            us.groups.Add(group);
        }

        public void RemoveFromGroup(string group, string connectionId)
        {
            if (Consts.IS_SOCKET_DISABLE) return;

            var us = _users.FirstOrDefault(x => x.connectionId == connectionId);
            if (us == null) return;
            if (us.groups == null) us.groups = new HashSet<string>();
            if (us.groups.Contains(group))
                us.groups.Remove(group);
        }

        public void AddUser(User user)
        {
            if (Consts.IS_SOCKET_DISABLE) return;

            RemoveUser(user.connectionId);
            lock (_lock)
            {
                _users.Add(new User
                {
                    id = user.id,
                    socket = user.socket,
                    connectionId = user.connectionId,
                    lang = user.lang,
                    groups = new HashSet<string>(),
                    firstName = user.firstName,
                    lastName = user.lastName,
                });
                SendToGroup(user.lang, Consts.ONLINE_USERS, _users.DistinctBy(p => p.id).ToList(), true);
                //SendToGroup(user.lang, Consts.ALL_CONNECTIONS, _users.ToList(), true);
            }
        }

        public void RemoveUser(string connectionId)
        {
            if (Consts.IS_SOCKET_DISABLE) return;

            lock (_lock)
            {
                var us = _users.FirstOrDefault(x => x.connectionId == connectionId);
                if (us == null) return;
                us.socket = null;
                us.groups = null;
                _users.Remove(us);
                SendToGroup(us.lang, Consts.ONLINE_USERS, _users.DistinctBy(p => p.id).ToList(), true);
                //SendToGroup(us.lang, Consts.ALL_CONNECTIONS, _users.ToList(), true);
            }
        }
    }
}
