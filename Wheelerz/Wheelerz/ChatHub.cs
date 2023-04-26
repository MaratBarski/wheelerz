using Microsoft.AspNetCore.SignalR;
using Wheelerz.Filters;
using Wheelerz.Helpers;
using Wheelerz.Services;

#pragma warning disable CS8602
#pragma warning disable CS8765
#pragma warning disable CS0162

namespace Wheelerz
{
    [AuthFilter]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        private readonly IUserService _userService;
        public ChatHub(IChatService chatService, IUserService userService)
        {
            _chatService = chatService;
            _userService = userService;
            
        }

        public async Task JoinRoom(string room)
        {
            _chatService.AddToGroup(room, Context.ConnectionId);
            await Groups.AddToGroupAsync(Context.ConnectionId, room);
        }

        public async Task LeaveRoom(string room)
        {
            if (Consts.IS_SOCKET_DISABLE) return;

            _chatService.RemoveFromGroup(room, Context.ConnectionId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, room);
        }

        public void SendHello()
        {
            Clients.All.SendAsync("Connected", "Hello");
        }

        public override Task OnConnectedAsync()
        {
            if (Consts.IS_SOCKET_DISABLE) return base.OnConnectedAsync();

            //var u = Context.User;
            var us = _userService.CurrentUser;
            us.socket = Clients.Client(Context.ConnectionId);
            us.connectionId = Context.ConnectionId;
            _chatService.AddUser(us);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (Consts.IS_SOCKET_DISABLE) return base.OnDisconnectedAsync(exception);

            _chatService.RemoveUser(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
