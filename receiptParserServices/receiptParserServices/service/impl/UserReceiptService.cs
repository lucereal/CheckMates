using Microsoft.Extensions.Logging;
using receiptParserServices.domain;
using receiptParserServices.repository.inter;
using receiptParserServices.repository.mappers;
using receiptParserServices.repository.model;
using receiptParserServices.service.inter;
using receiptParserServices.util.error;
using shortid;
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
        private readonly IMongoRepository<Receipt> _userReceiptRepository;

        public UserReceiptService(ILoggerFactory loggerFactory, IReceiptRepository receiptRepository, IMongoRepository<Receipt> userReceiptRepository)
        {
            _logger = loggerFactory.CreateLogger<ParseReceipt>();
            _receiptRepository = receiptRepository;
            _userReceiptRepository = userReceiptRepository;
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

        public async Task<ReceiptDto> AddUsersToReceipt(string id, List<string> users)
        {
            Receipt resultReceipt;

            Receipt receipt = await _receiptRepository.getReceiptById(id);

            resultReceipt = receipt;

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }

            List<User> userList = new List<User>();

            var generateOptions = new shortid.Configuration.GenerationOptions(true, false, 8);

            foreach (var uName in users)
            {
                string userId = ShortId.Generate(generateOptions);
                User nUser = new User();
                nUser.userId = userId;
                nUser.name = uName;
                userList.Add(nUser);
            }

            receipt.users.AddRange(userList);

            resultReceipt = await _receiptRepository.updateReceipt(receipt);

            return ReceiptMapper.MapReceiptToReceiptDto(resultReceipt);
        }

        public async Task<Receipt> CreateReceipt(ReceiptDto receiptDto)
        {
            Receipt resultReceipt = ReceiptMapper.MapReceiptDtoToReceipt(receiptDto);

            await _userReceiptRepository.InsertOneAsync(resultReceipt);


            return resultReceipt;
        }
        public async Task<ReceiptDto> GetReceipt(string id)
        {
            var receipt = await _userReceiptRepository.FindByIdAsync(id);
            if (receipt == null) throw new HandleReceiptException("Could not find receipt in UserReceiptService.GetReceipt id: " + id, HandleReceiptFailureReason.CouldNotFindReceipt);
            return ReceiptMapper.MapReceiptToReceiptDto(receipt);
        }

       

    }
}
