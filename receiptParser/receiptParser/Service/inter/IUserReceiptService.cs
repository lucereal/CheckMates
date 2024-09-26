using receiptParser.Domain;
using receiptParser.Repository.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Service.inter
{
    public interface IUserReceiptService
    {
        Task<ReceiptDto> AddUserClaim(string id, string userId, int itemId, int quantity);
        Task<ReceiptDto> UpdateUserClaim(string id, string userId, int itemId, int quantity);
        Task<ReceiptDto> AddUsersToReceipt(string id, List<string> users);
        Task<ReceiptDto> CreateReceipt(ReceiptDto receiptDto);
        Task<ReceiptDto> GetReceipt(string id);

        Task<ReceiptDto> AddConnectionId(string receiptId, string userConnectionId);

        Task<ReceiptDto> RemoveConnectionId(string receiptId, string userConnectionId);

        Task<Boolean> RemoveUserConnectionId(string userConnectionId);

        Task<ReceiptDto> EditItem(string id, int itemId, double price, double quantity, string description);

        Task<ReceiptDto> DeleteItem(string id, int itemId);

        Task<ReceiptDto> AddItem(string id, double price, double quantity, string description);

        Task<ReceiptDto> RemoveUserClaim(string id, string userId, int itemId);
        Task<ReceiptDto> UpdateUsers(ReceiptDto receiptDto);

    }
}
