using Microsoft.AspNetCore.SignalR;
using Wheelerz.Helpers;
using Wheelerz.Models;

#pragma warning disable CS8604
#pragma warning disable CS0162

namespace Wheelerz.Services
{
    public delegate void SendToGroupDelegate(string lang, string group, object message, bool sendToAll = false);
    public interface IChatService
    {
        void AddUser(User user);
        void RemoveUser(string connectionId);
        void AddToGroup(string group, string connectionId);
        void RemoveFromGroup(string group, string connectionId);
        void Send(string lang, string group, object message, bool sendToAll = false);
    }
    public class ChatService : IChatService
    {
        private List<User> _users = new();
        private Object _lock = new();

        public ChatService()
        {
            _onSendToGroup += ChatService_onSendToGroup;
        }

        private void ChatService_onSendToGroup(string lang, string group, object message, bool sendToAll = false)
        {
            SendToGroup(lang, group, message, sendToAll);
        }

        private event SendToGroupDelegate _onSendToGroup;

        public void Send(string lang, string group, object message, bool sendToAll = false)
        {
            if (Consts.IS_SOCKET_DISABLE) return;

            _onSendToGroup(lang, group, message, sendToAll);
        }

        private async void SendToGroup(string lang, string group, object message, bool sendToAll = false)
        {
            if (Consts.IS_SOCKET_DISABLE) return;
            try
            {
                var users = _users.Where(x => x.lang == lang && sendToAll || (x.groups != null && x.groups.Contains(group)));
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
