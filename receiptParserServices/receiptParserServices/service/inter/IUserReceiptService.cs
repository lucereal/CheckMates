using receiptParserServices.repository.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.service.inter
{
    internal interface IUserReceiptService
    {
        Task<Receipt> UpdateUserClaim(string id, string userId, int itemId, int quantity);
        Task<Receipt> AddUsersToReceipt(string id, List<string> users);
    }
}
