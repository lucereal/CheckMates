using Microsoft.AspNetCore.SignalR;
using receiptParserServices.domain;
using receiptParserServices.repository.inter;
using receiptParserServices.repository.mappers;
using receiptParserServices.repository.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices
{
    internal class SignalHub : Hub
    {
        private readonly static ConnectionMapping<string> _connections =
            new ConnectionMapping<string>();

        private readonly IMongoRepository<Receipt> _userReceiptRepository;
        public SignalHub(IMongoRepository<Receipt> userReceiptRepository)
        {
            _userReceiptRepository = userReceiptRepository;
        }
        public async Task ConnectUser(string user, string userId, string receiptId)
        {
            ReceiptDto receiptDto = ReceiptMapper.MapReceiptToReceiptDto(_userReceiptRepository.FindById(receiptId));

            string userConnectionId = Context.ConnectionId;

            UserDto? userDto = receiptDto.users.Where(user => user.userId == userId).FirstOrDefault();

            if(null != userDto)
            {
                userDto.connectionId = userConnectionId;
                await _userReceiptRepository.ReplaceOneAsync(ReceiptMapper.MapReceiptDtoToReceipt(receiptDto));
                
                await Clients.Client(userConnectionId).SendAsync("UserConnected", userId, receiptId);
            }


        }
    }
}
