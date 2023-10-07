using MongoDB.Bson;
using receiptParserServices.repository.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.repository.inter
{
    internal interface IReceiptRepository
    {
        Task<Receipt> getReceiptById(string id);
        Task<Receipt> createReceipt(Receipt receipt);
        Task<Receipt> updateReceipt(Receipt receipt);

        Task<Receipt> addUserToReceipt(string id, string userName);

        Task<Receipt> addUserClaimToReceipt(string id, string userId, int itemId, int quantity, double? price);
    }
}
