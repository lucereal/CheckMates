﻿using receiptParser.Domain;
using receiptParser.Repository.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Service.inter
{
    internal interface IUserReceiptService
    {
        Task<ReceiptDto> AddUserClaim(string id, string userId, int itemId, int quantity);
        Task<ReceiptDto> UpdateUserClaim(string id, string userId, int itemId, int quantity);
        Task<ReceiptDto> AddUsersToReceipt(string id, List<string> users);
        Task<ReceiptDto> CreateReceipt(ReceiptDto receiptDto);
        Task<ReceiptDto> GetReceipt(string id);
    }
}
