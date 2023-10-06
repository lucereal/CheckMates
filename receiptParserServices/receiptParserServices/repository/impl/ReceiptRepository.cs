using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using receiptParserServices.repository.model;
using receiptParserServices.repository.inter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.IdGenerators;
using receiptParserServices.domain;
using static MongoDB.Driver.WriteConcern;
using shortid;
using receiptParserServices.util.error;

namespace receiptParserServices.repository.impl
{
    internal class ReceiptRepository : IReceiptRepository
    {
        private readonly ILogger _logger;
        

        protected readonly IMongoDBContext _mongoContext;
        protected IMongoCollection<Receipt> _dbCollection;

        public ReceiptRepository(ILoggerFactory loggerFactory, IMongoDBContext mongoDBContext)
        {
            _logger = loggerFactory.CreateLogger<ParseReceipt>();

            _mongoContext = mongoDBContext;
            _dbCollection = _mongoContext.GetCollection<Receipt>("receipts");

        }


        public async Task<Receipt> getReceiptById(string id)
        {
            var objectId = new ObjectId(id);
            FilterDefinition<Receipt> filter = Builders<Receipt>.Filter.Eq("_id", objectId);

            return await _dbCollection.FindAsync(filter).Result.FirstOrDefaultAsync();
        }

        public async Task<Receipt> createReceipt(Receipt receipt)
        {
            if (receipt == null)
            {
                throw new ArgumentNullException(typeof(Receipt).Name + " object is null");
            }
            await _dbCollection.InsertOneAsync(receipt);
            return receipt;
        }

        public async Task<Receipt> updateReceipt(Receipt receipt)
        {
            if (receipt == null)
            {
                throw new ArgumentNullException(typeof(Receipt).Name + " object is null");
            }
            var filter = Builders<Receipt>.Filter.Eq(x => x.Id, receipt.Id);
            var update = Builders<Receipt>.Update.Set(x => x, receipt);
            var options = new FindOneAndReplaceOptions<Receipt> { ReturnDocument = ReturnDocument.After };
            return await _dbCollection.FindOneAndReplaceAsync(filter, receipt,options);

        }

        public async Task<Receipt> addUserToReceipt(string id, string userName)
        {
            var generateOptions = new shortid.Configuration.GenerationOptions(true, false, 8);
            string userId = ShortId.Generate(generateOptions);

            User user = new User();
            user.name = userName;
            user.userId = userId;

            var filter = Builders<Receipt>.Filter.Eq(x => x.Id, ObjectId.Parse(id));
            var update = Builders<Receipt>.Update.AddToSet(x => x.users, user);

            var options = new FindOneAndUpdateOptions<Receipt> { ReturnDocument = ReturnDocument.After };

            Receipt receipt = await _dbCollection.FindOneAndUpdateAsync(filter, update, options);
            return receipt;
        }

        public async Task<Receipt> addUsersToReceipt(string id, List<string> users)
        {
            List<User> userList = new List<User>();

            users.ForEach(x =>
            {
                var generateOptions = new shortid.Configuration.GenerationOptions(true, false, 8);
                string userId = ShortId.Generate(generateOptions);

                User user = new User();
                user.name = x;
                user.userId = userId;
                userList.Add(user);
            });
            

            var filter = Builders<Receipt>.Filter.Eq(x => x.Id, ObjectId.Parse(id));
            var update = Builders<Receipt>.Update.AddToSetEach(x => x.users, userList);


            var options = new FindOneAndUpdateOptions<Receipt> { ReturnDocument = ReturnDocument.After };

            Receipt receipt = await _dbCollection.FindOneAndUpdateAsync(filter, update, options);
            return receipt;
        }


        //todo: handle same user inserting new claim
        public async Task<Receipt> addUserClaimToReceipt(string id, string userId, int itemId, int quantity, double? price)
        {
            try
            {
                Receipt receipt = await getReceiptById(id);
                if (receipt != null)
                {
                    bool hasUser = receipt.users.Select(x => x.userId).Contains(userId);
                    bool hasItem = receipt.items.Select(x => x.itemId).Contains(itemId);

                    if (hasUser && hasItem)
                    {
                        Item item = receipt.items.First(x => x.itemId == itemId);
                        int claimsQuantitySum = item.claims.Sum(x => x.quantity);
                        double claimsTotalSum = item.claims.Sum(x => x.total);
                        bool canAddClaim = ((claimsQuantitySum + quantity) <= item.quantity) && ((claimsTotalSum + price ?? 0) <= item.price);
                        if (canAddClaim)
                        {
                            Claim claim = new Claim();
                            claim.quantity = quantity;
                            claim.userId = userId;
                            if (price != null)
                            {
                                claim.total = (double)price;
                            }
                            else
                            {
                                claim.total = item.price;
                            }
                            item.claims.Add(claim);
                            return await updateReceipt(receipt);
                        }
                        else
                        {
                            throw new HandleReceiptException("Requested claim quantity or total exceeded item quantity or total.", HandleReceiptFailureReason.CouldNotAddClaim);
                        }

                    }
                    else
                    {
                        throw new HandleReceiptException("Requested user or item could not be found in receipt.", HandleReceiptFailureReason.CouldNotFindUserOrItem);
                    }
                }
                else
                {
                    throw new HandleReceiptException("Could not find receipt", HandleReceiptFailureReason.CouldNotFindReceipt);
                }
            }
            catch(HandleReceiptException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                throw new HandleReceiptException(ex.Message, HandleReceiptFailureReason.DataRetrievalIssue);
            }

        }

    }
}
