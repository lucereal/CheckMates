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

        private readonly ILogger _logger;

        private readonly IUserReceiptService _userReceiptService;

        public ChatHub(ILoggerFactory loggerFactory, IUserReceiptService userReceiptService)
        {
            _logger = loggerFactory.CreateLogger<ChatHub>();
            _userReceiptService = userReceiptService;
        }

        public async Task AddUserConnectionId(string receiptId)
        {
            await _userReceiptService.AddConnectionId(receiptId, Context.ConnectionId);
        }

        public void GroupUpdateReceived(string receiptId, string connectionId)
        {
            _logger.LogInformation("GroupUpdateReceived: receiptId: " + receiptId + " connectionId: " + connectionId);
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
