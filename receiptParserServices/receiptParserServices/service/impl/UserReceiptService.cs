using Microsoft.Extensions.Logging;
using receiptParserServices.repository.inter;
using receiptParserServices.repository.model;
using receiptParserServices.service.inter;
using receiptParserServices.util.error;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.service.impl
{
    internal class UserReceiptService : IUserReceiptService
    {

        private readonly ILogger _logger;

        private readonly IReceiptRepository _receiptRepository;

        public UserReceiptService(ILoggerFactory loggerFactory, IReceiptRepository receiptRepository)
        {
            _logger = loggerFactory.CreateLogger<ParseReceipt>();
            _receiptRepository = receiptRepository;
        }

        public async Task<Receipt> UpdateUserClaim(string id, string userId, int itemId, int quantity)
        {
            Receipt resultReceipt;

            Receipt receipt = await _receiptRepository.getReceiptById(id);

            resultReceipt = receipt;

            if(receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindReceipt);   
            }

            Item? item = receipt.items.Where(x => x.itemId == itemId).FirstOrDefault();

            if(item == null) { throw new HandleReceiptException("Could not find item in receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindUserOrItem); }

            Claim? claim = item.claims.Where(x => x.userId == userId).FirstOrDefault();

            if(claim == null) { throw new HandleReceiptException("Could not find claim in receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindUserOrItem); }

            
            List<Claim> otherUserClaims = item.claims.Where(x => x.userId != userId).ToList();

            int otherUserClaimsQuantity = otherUserClaims.Sum(x => x.quantity);

            if(otherUserClaimsQuantity + claim.quantity > item.quantity)
            {
                throw new HandleReceiptException("Could not update user claim because of invalid quantity.", HandleReceiptFailureReason.CouldNotAddClaim);
                //quantity is full
            }else if(otherUserClaimsQuantity + quantity > item.quantity)
            {
                //cannot add this quantity bc it surpases item quantity
                throw new HandleReceiptException("Could not update user claim because of invalid quantity.", HandleReceiptFailureReason.CouldNotAddClaim);
            }
            else
            {
                claim.quantity = quantity;
                resultReceipt = await _receiptRepository.updateReceipt(receipt);
            }

            return resultReceipt;

        }
    }
}
