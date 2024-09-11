using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using receiptParser;
using receiptParser.Controllers;
using receiptParser.Domain;
using receiptParser.Repository.model;
using receiptParser.Service.impl;
using receiptParser.Service.inter;
using System.Net;

namespace receiptParser.Hubs
{
    public class ChatHub : Hub
    {
        private readonly static ConnectionMapping<string> _connections =
            new ConnectionMapping<string>();

        private readonly ILogger _logger;

        private readonly IUserReceiptService _userReceiptService;

        public ChatHub(ILoggerFactory loggerFactory, IUserReceiptService userReceiptService)
        {
            _logger = loggerFactory.CreateLogger<ChatHub>();
            _userReceiptService = userReceiptService;
        }

        /*
         * for any event from a user, that the other users need to be updated for
         * just send a message to all other users with the updated receipt. 
         * no need to have specific actions for each action
         */

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);


        }
        public async Task AddUser(string user, string message)
        {
            if (!_connections.GetConnections(user).Contains(Context.ConnectionId))
            {
                _connections.Add(user, Context.ConnectionId);
                //add user connection id to receipt user list so they can receive updates
                //need receipt id and user id and user connection id

            }
            await Clients.All.SendAsync("UserAdded", user, message);
        }

        public async Task AddUserItem(string request)
        {
            ReceiptResponse receiptResponse = new ReceiptResponse();
            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            receiptResponse.isSuccess = false;
            try
            {
                AddUserItemRequest? addUserItemRequest = Newtonsoft.Json.JsonConvert.DeserializeObject<AddUserItemRequest>(request); 

                if (addUserItemRequest != null)
                {
                    ReceiptDto resultReceiptDto = await _userReceiptService.AddUserClaim(addUserItemRequest.id, addUserItemRequest.userId, 
                        addUserItemRequest.itemId, addUserItemRequest.quantity);

                    receiptResponse.isSuccess = true;
                    receiptResponse.message = "Receipt created.";

                    receiptResponse.receipt = resultReceiptDto;


                    await Clients.Client(Context.ConnectionId).SendAsync("UserItemAdded", receiptResponse);

                    await _userReceiptService.UpdateUsers(resultReceiptDto);
                    

                }
                else
                {
                    receiptResponse.isSuccess = false;
                    receiptResponse.message = "Could not parse request object";
                    resultStatusCode = HttpStatusCode.BadRequest;
                }
            }
            catch(Exception ex)
            {
                receiptResponse.isSuccess = false;
                resultStatusCode = HttpStatusCode.InternalServerError;
            }


        }

        public async Task AddUserConnectionId(string receiptId, string userId)
        {
            //if (!_connections.GetConnections(user).Contains(Context.ConnectionId))
            //{
            //_connections.Add(user, Context.ConnectionId);
            //add user connection id to receipt user list so they can receive updates
            //need receipt id and user id and user connection id
            await _userReceiptService.AddUserConnectionId(receiptId, Context.ConnectionId, userId);

            //}
            //await Clients.All.SendAsync("UserAdded", user, message);
        }

        //public Task JoinRoom(string roomName)
        //{
        //    return Groups.Add(Context.ConnectionId, roomName);
        //}

        //public Task LeaveRoom(string roomName)
        //{
        //    return Groups.Remove(Context.ConnectionId, roomName);
        //}
        public async Task AddUserToGroup(string group, string user, string message)
        {

            await Groups.AddToGroupAsync(Context.ConnectionId, group);
            //this group update works
            //seems that the group membership is not persisted beyond the current connection
            //will need to store connection ids for groups in a database
            await Clients.Group(group).SendAsync("GroupUpdate", "fdofaf");
            await Clients.All.SendAsync("UserAddedToGroup", group, user, message);
        }

        public async Task RemoveUserFromGroup(string group, string user, string message)
        {

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
            //remove user from receipt connection list so they don't receive updates anymore

            await Clients.All.SendAsync("UserRemovedFromGroup", group, user, message);
        }

        public void GroupUpdateReceived(string receiptId, string connectionId)
        {
            _logger.LogInformation("GroupUpdateReceived: receiptId: " + receiptId + " connectionId: " + connectionId);
        }

        public void SendChatMessage(string who, string message)
        {

            foreach (var connectionId in _connections.GetConnections(who))
            {
                Clients.Client(connectionId).SendAsync("ReceiveMessage", who, message);
            }
        }

        public void SendChatMessageToGroup(string group, string message)
        {

            //Clients.Group(group).addChatMessage(name, message);
            Clients.Group(group).SendAsync("GroupUpdate", message);
        }

        public override Task OnConnectedAsync()
        {


            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {


            return base.OnDisconnectedAsync(exception);

        }



    }
}
