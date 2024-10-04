using Amazon.SecurityToken.SAML;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using receiptParser.Domain;
using receiptParser.Hubs;
using receiptParser.Repository.inter;
using receiptParser.Repository.mappers;
using receiptParser.Repository.models;
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
using System.Text.Json;
using System.IO;

namespace receiptParser.Service.impl
{
    public class UserReceiptService : IUserReceiptService
    {

        private readonly ILogger _logger;


        private readonly IMongoRepository<Receipt> _userReceiptRepository;

        private readonly IMongoRepository<Connection> _userConnectionRepository;


        private readonly IHubContext<ChatHub> _hubContext;

        private readonly IConfiguration _configuration;

        public UserReceiptService(IConfiguration configuration,ILoggerFactory loggerFactory, IMongoRepository<Receipt> userReceiptRepository, IMongoRepository<Connection> userConnectionRepository, IHubContext<ChatHub> hubContext)
        {
            _logger = loggerFactory.CreateLogger<UserReceiptService>();        
            _userReceiptRepository = userReceiptRepository;
            _userConnectionRepository = userConnectionRepository;
            _hubContext = hubContext;
            _configuration = configuration;
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

            //List<Claim> otherUserClaims = item.claims.Where(x => x.userId != userId).ToList();

            //int otherUserClaimsQuantity = otherUserClaims.Sum(x => x.quantity);

            Claim? claim = item.claims.Where(x => x.userId == userId).FirstOrDefault();
          
            //if (otherUserClaimsQuantity + quantity > item.quantity)
            //{
            //    //cannot add this quantity bc it surpases item quantity
            //    throw new HandleReceiptException("Could not update user claim because of invalid quantity.", HandleReceiptFailureReason.CouldNotAddClaim);
            //}     
            if (claim == null)
            {
                Claim nClaim = new Claim();
                nClaim.quantity = quantity;
                nClaim.userId = userId;
                item.claims.Add(nClaim);
            }
            else
            {
                throw new HandleReceiptException("Could not add claim to item because claim already exists.", HandleReceiptFailureReason.CouldNotAddClaim);
                //if (otherUserClaimsQuantity + claim.quantity > item.quantity)
                //{
                //    throw new HandleReceiptException("Could not update user claim because of invalid quantity.", HandleReceiptFailureReason.CouldNotAddClaim);
                //    //quantity is full
                //}
                //claim.quantity = quantity;
                
           
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

        public async Task<ReceiptDto> EditItem(string id, int itemId, double price, double quantity, string description)
        {

           Receipt receipt = await _userReceiptRepository.FindByIdAsync(id);

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update item.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }

            Item? item = receipt.items.Where(x => x.itemId == itemId).FirstOrDefault();

            if (item == null) { throw new HandleReceiptException("Could not find item in receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindUserOrItem); }

            item.price = price;
            item.quantity = quantity;
            item.description = description;

            if (receipt.items != null)
            {
                receipt.total = GetTotalPrice(receipt.items);
            }

            await _userReceiptRepository.ReplaceOneAsync(receipt);
            await UpdateUsers(receipt);

            return ReceiptMapper.MapReceiptToReceiptDto(receipt);
        }

        public async Task<ReceiptDto> DeleteItem(string id, int itemId)
        {
            Receipt receipt = await _userReceiptRepository.FindByIdAsync(id);

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update item.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }

            receipt.items.RemoveAll(x => x.itemId == itemId);

            if (receipt.items != null)
            {
                receipt.total = GetTotalPrice(receipt.items);
            }


            await _userReceiptRepository.ReplaceOneAsync(receipt);
            await UpdateUsers(receipt);

            return ReceiptMapper.MapReceiptToReceiptDto(receipt);
        }

        public async Task<ReceiptDto> AddItem(string id, double price, double quantity, string description)
        {
            Receipt receipt = await _userReceiptRepository.FindByIdAsync(id);

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update item.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }


            if (quantity > 0)
            {
                for (int i = 0; i < quantity; i++)
                {
                    Item newItem = new Item();
                    newItem.description = description;
                    newItem.price = price;
                    newItem.quantity = 1;
                    int largestItemId = receipt.items?.Any() == true ? receipt.items.Max(item => item.itemId) : 0;
                    newItem.itemId = largestItemId + 1;
                    receipt.items?.Add(newItem);
                }
            }
            else
            {
                Item newItem = new Item();

                newItem.description = description;
                newItem.price = price;
                newItem.quantity = 1;
                int largestItemId = receipt.items?.Any() == true ? receipt.items.Max(item => item.itemId) : 0;
                newItem.itemId = largestItemId + 1;
                receipt.items?.Add(newItem);   
            }

            if(receipt.items != null)
            {
                receipt.total = GetTotalPrice(receipt.items);
            }

            //int largestItemId = receipt.items?.Any() == true ? receipt.items.Max(item => item.itemId) : 0;


            //Item item = new Item();
            //item.itemId = largestItemId + 1;
            //item.price = price;
            //item.quantity = quantity;
            //item.description = description;

            //receipt.items?.Add(item);

            await _userReceiptRepository.ReplaceOneAsync(receipt);
            await UpdateUsers(receipt);

            return ReceiptMapper.MapReceiptToReceiptDto(receipt);
        }

        public async Task<ReceiptDto> DeleteUsersFromReceipt(string id, string userId)
        {
            Receipt receipt = await _userReceiptRepository.FindByIdAsync(id);

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }


            receipt.users.RemoveAll(user => user.userId == userId);

            foreach (var item in receipt.items)
            {
                item.claims.RemoveAll(claim => claim.userId == userId);
            }

            await _userReceiptRepository.ReplaceOneAsync(receipt);

            await UpdateUsers(receipt);

            return ReceiptMapper.MapReceiptToReceiptDto(receipt);
        }
        private double GetTotalPrice(List<Item> items)
        {
            double total = 0;
            foreach(Item item in items)
            {
                total += item.price;
            }
            return total;
        }

        public async Task<ReceiptDto> GetReceiptExample()
        {

            var filePath = Path.Combine(AppContext.BaseDirectory, "ExampleReceipt.json");

            // Read the JSON file
            var json = System.IO.File.ReadAllText(filePath);

            // Deserialize the JSON into a ReceiptDto object
            var receiptRequest = JsonSerializer.Deserialize<ReceiptRequest>(json);


            if (receiptRequest == null || receiptRequest.receipt == null) throw new HandleReceiptException("Could read ExampleReceipt.json in UserReceiptService.GetReceiptExample " , HandleReceiptFailureReason.CouldNotFindReceipt);
           
            return await CreateReceipt(receiptRequest.receipt);
        }
        public async Task<ReceiptDto> CreateEmptyReceipt(List<string> users)
        {
            List<UserDto> userDtos = ReceiptMapper.MapUserNamesToUserDtos(users);

            ReceiptDto receiptDto = new ReceiptDto();
            receiptDto.users = userDtos;

            Receipt receipt = ReceiptMapper.MapReceiptDtoToReceipt(receiptDto);
            receipt.originalReceipt = receipt.createCopy();

            await _userReceiptRepository.InsertOneAsync(receipt);


            return ReceiptMapper.MapReceiptToReceiptDto(receipt);
        }
        public async Task<ReceiptDto> CreateReceipt(ReceiptDto receiptDto)
        {
            Receipt receipt = ReceiptMapper.MapReceiptDtoToReceipt(receiptDto);
            receipt.originalReceipt = receipt.createCopy();

            receipt.items.RemoveAll(x => x.price <= 0);

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
            Connection connection = new Connection();
            connection.receiptId = receiptId;
            connection.connectionId = connectionId;
            connection.connected = true;

            if (receipt == null)
            {
                throw new HandleReceiptException("Could not find receipt while trying to update.", HandleReceiptFailureReason.CouldNotFindReceipt);
            }

            if (!receipt.connectionIds.Contains(connectionId))
            {
                receipt.connectionIds.Add(connectionId);
                await _userConnectionRepository.InsertOneAsync(connection);
                
            }

            await _userReceiptRepository.ReplaceOneAsync(receipt);

        
            await UpdateUsers(receipt);

            return ReceiptMapper.MapReceiptToReceiptDto(receipt);

        }


        public async Task<Boolean> RemoveUserConnectionId(string connectionId)
        {
            Connection connection = await _userConnectionRepository.FindOneAsync(x => x.connectionId == connectionId);
            if(connection != null)
            {
                Receipt receipt = await _userReceiptRepository.FindByIdAsync(connection.receiptId);

                await RemoveConnectionId(receipt._id.ToString(), connectionId);

                return true;
            }
            return false;

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
                await _userConnectionRepository.DeleteOneAsync(x => x.connectionId == connectionId);
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
