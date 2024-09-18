﻿using Amazon.SecurityToken.SAML;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using receiptParser.Domain;
using receiptParser.Hubs;
using receiptParser.Repository.inter;
using receiptParser.Repository.mappers;
using receiptParser.Repository.model;
using receiptParser.Service.inter;
using receiptParser.Util.error;
using shortid;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace receiptParser.Service.impl
{
    public class UserReceiptService : IUserReceiptService
    {

        private readonly ILogger _logger;


        private readonly IMongoRepository<Receipt> _userReceiptRepository;


        private readonly IHubContext<ChatHub> _hubContext;

        public UserReceiptService(ILoggerFactory loggerFactory, IMongoRepository<Receipt> userReceiptRepository, IHubContext<ChatHub> hubContext)
        {
            _logger = loggerFactory.CreateLogger<UserReceiptService>();        
            _userReceiptRepository = userReceiptRepository;
            _hubContext = hubContext;
        }

        public async Task<ReceiptDto> UpdateUserClaim(string id, string userId, int itemId, int quantity)
        {
            Receipt receipt = await _userReceiptRepository.FindByIdAsync(id);

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
                await _userReceiptRepository.ReplaceOneAsync(receipt);
                await UpdateUsers(receipt);
            }

            

            return ReceiptMapper.MapReceiptToReceiptDto(receipt);

        }

        public async Task<ReceiptDto> AddUserClaim(string id, string userId, int itemId, int quantity)
        {
            Receipt receipt = await _userReceiptRepository.FindByIdAsync(id);

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }

            Item? item = receipt.items.Where(x => x.itemId == itemId).FirstOrDefault();

            if (item == null) { throw new HandleReceiptException("Could not find item in receipt while trying to add claim.", HandleReceiptFailureReason.CouldNotFindUserOrItem); }

            List<Claim> otherUserClaims = item.claims.Where(x => x.userId != userId).ToList();

            int otherUserClaimsQuantity = otherUserClaims.Sum(x => x.quantity);

            Claim? claim = item.claims.Where(x => x.userId == userId).FirstOrDefault();
          
            if (otherUserClaimsQuantity + quantity > item.quantity)
            {
                //cannot add this quantity bc it surpases item quantity
                throw new HandleReceiptException("Could not update user claim because of invalid quantity.", HandleReceiptFailureReason.CouldNotAddClaim);
            }     
            if (claim == null)
            {
                Claim nClaim = new Claim();
                nClaim.quantity = quantity;
                nClaim.userId = userId;
                item.claims.Add(nClaim);
            }
            else
            {
                if (otherUserClaimsQuantity + claim.quantity > item.quantity)
                {
                    throw new HandleReceiptException("Could not update user claim because of invalid quantity.", HandleReceiptFailureReason.CouldNotAddClaim);
                    //quantity is full
                }
                claim.quantity = quantity;
                
            
            }
            await _userReceiptRepository.ReplaceOneAsync(receipt);
            await UpdateUsers(receipt);
            return ReceiptMapper.MapReceiptToReceiptDto(receipt);

        }

        public async Task<ReceiptDto> RemoveUserClaim(string id, string userId, int itemId)
        {
            Receipt receipt = await _userReceiptRepository.FindByIdAsync(id);

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }

            Item? item = receipt.items.Where(x => x.itemId == itemId).FirstOrDefault();

            if (item == null) { throw new HandleReceiptException("Could not find item in receipt while trying to add claim.", HandleReceiptFailureReason.CouldNotFindUserOrItem); }

            Claim? claim = item.claims.Where(x => x.userId == userId).FirstOrDefault();

            if(claim != null)
            {
                item.claims.Remove(claim);
            }
            else
            {
                throw new HandleReceiptException("Could not remove claim from item because no claim was found for user.", HandleReceiptFailureReason.CouldNotFindUserOrItem);
            }

            await _userReceiptRepository.ReplaceOneAsync(receipt);
            await UpdateUsers(receipt);
            return ReceiptMapper.MapReceiptToReceiptDto(receipt);
        }
        public async Task<ReceiptDto> AddUsersToReceipt(string id, List<string> users)
        {
            Receipt receipt = await _userReceiptRepository.FindByIdAsync(id);    

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }

            List<User> userList = ReceiptMapper.MapUserNamesToUsers(users);
       
            receipt.users.AddRange(userList);

            await _userReceiptRepository.ReplaceOneAsync(receipt);

            await UpdateUsers(receipt);

            return ReceiptMapper.MapReceiptToReceiptDto(receipt);
        }

      

        public async Task<ReceiptDto> CreateReceipt(ReceiptDto receiptDto)
        {
            Receipt receipt = ReceiptMapper.MapReceiptDtoToReceipt(receiptDto);

            await _userReceiptRepository.InsertOneAsync(receipt);


            return ReceiptMapper.MapReceiptToReceiptDto(receipt);
        }
        public async Task<ReceiptDto> GetReceipt(string id)
        {
            var receipt = await _userReceiptRepository.FindByIdAsync(id);
            if (receipt == null) throw new HandleReceiptException("Could not find receipt in UserReceiptService.GetReceipt id: " + id, HandleReceiptFailureReason.CouldNotFindReceipt);
            return ReceiptMapper.MapReceiptToReceiptDto(receipt);
        }

        public async Task<ReceiptDto> AddConnectionId(string receiptId, string connectionId)
        {
            Receipt receipt = await _userReceiptRepository.FindByIdAsync(receiptId);

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }

            if (!receipt.connectionIds.Contains(connectionId))
            {
                receipt.connectionIds.Add(connectionId);
            }

            await _userReceiptRepository.ReplaceOneAsync(receipt);
        
            await UpdateUsers(receipt);

            return ReceiptMapper.MapReceiptToReceiptDto(receipt);

        }

        public async Task<ReceiptDto> RemoveConnectionId(string receiptId, string connectionId)
        {
            Receipt receipt = await _userReceiptRepository.FindByIdAsync(receiptId);

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }

            if (receipt.connectionIds.Contains(connectionId))
            {
                receipt.connectionIds.Remove(connectionId);
            }

            await _userReceiptRepository.ReplaceOneAsync(receipt);

            await UpdateUsers(receipt);

            return ReceiptMapper.MapReceiptToReceiptDto(receipt);

        }

        public async Task<ReceiptDto> UpdateUsers(ReceiptDto receiptDto)
        {
            if(receiptDto._id == null)
            {
                throw new HandleReceiptException("Could not find receipt because receipt._id is null.", HandleReceiptFailureReason.CouldNotFindReceipt);

            }
            Receipt receipt = await _userReceiptRepository.FindByIdAsync(receiptDto._id);

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }

            List<string> connectionIds = receipt.connectionIds;

            ReceiptDto updatedReceiptDto = ReceiptMapper.MapReceiptToReceiptDto(receipt);

            await _hubContext.Clients.Clients(connectionIds).SendAsync("GroupReceiptUpdate", receiptDto);

            return updatedReceiptDto;

        }

        public async Task<ReceiptDto> UpdateUsers(Receipt receipt)
        {
           
            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }

            Receipt updatedReceipt = await _userReceiptRepository.FindByIdAsync(receipt._id.ToString());

            List<string> connectionIds = updatedReceipt.connectionIds;

            ReceiptDto updatedReceiptDto = ReceiptMapper.MapReceiptToReceiptDto(updatedReceipt);

            await _hubContext.Clients.Clients(connectionIds).SendAsync("GroupReceiptUpdate", updatedReceiptDto);

            return updatedReceiptDto;

        }



    }
}