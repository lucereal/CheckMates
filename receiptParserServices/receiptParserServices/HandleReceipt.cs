using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using receiptParserServices.domain;
using System.Security.Authentication;
using System.Text.Json;
using static MongoDB.Driver.WriteConcern;
using MongoDB.Driver.Linq;

namespace receiptParserServices
{
    internal class HandleReceipt
    {
        private readonly ILogger _logger;
        private readonly string connectionString = @"mongodb://receiptstorage:dlJPotZLpCSxRAkF97PRD48aUmtqyjTnVVhFuWU5pvviiyngNdAkScyqOc2DlBSsfm3AiQAy83KcACDbuNIecg==@receiptstorage.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@receiptstorage@";
        MongoClientSettings settings;

        public HandleReceipt(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<ParseReceipt>();
            settings = MongoClientSettings.FromUrl(new MongoUrl(connectionString));
        }

        [Function("CreateReceipt")]
        public async Task<HttpResponseData> CreateReceipt([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {
                var mongoClient = new MongoClient(settings);

                var db = mongoClient.GetDatabase("receiptStorage");
                var _receipts = db.GetCollection<Receipt>("receipts");


                Receipt? model = await req.ReadFromJsonAsync<Receipt>();

                if (model != null)
                {
                    Guid receiptId = Guid.NewGuid();
                    model.receiptId = receiptId.ToString();
                    model._id = receiptId.ToString();
                    _receipts.InsertOne(model);
                    receiptResponse.isSuccess = true;
                    receiptResponse.receipt = model;
                }
                else
                {
                    receiptResponse.isSuccess = false;
                }
            }
            catch(Exception e)
            {
                receiptResponse.isSuccess = false;
                
            }


            string responseString = JsonSerializer.Serialize(receiptResponse);


            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(responseString);

            return response;
        }

        [Function("AddUser")]
        public async Task<HttpResponseData> AddUser([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();

            receiptResponse.isSuccess = false;
            try
            {
                var mongoClient = new MongoClient(settings);

                var db = mongoClient.GetDatabase("receiptStorage");
                var _receipts = db.GetCollection<Receipt>("receipts");


                AddUserRequest? model = await req.ReadFromJsonAsync<AddUserRequest>();

                if (model != null)
                {
                    Receipt receipt = _receipts.Find(x => x.receiptId == model.receiptId).First();
                    if(receipt  != null)
                    {
                        User user = model.user;
                        user.userId = receipt.users.Count();
                        receipt.users.Add(model.user);
                        var filter = Builders<Receipt>.Filter.Eq(x => x.receiptId, receipt.receiptId);
                        var update = Builders<Receipt>.Update.Set(x => x.users, receipt.users);
                        var updateReceipt = await _receipts.UpdateOneAsync(filter, update);
                        receiptResponse.isSuccess = true;
                        receiptResponse.receipt = receipt;

                    }
                    else
                    {
                        receiptResponse.isSuccess = false;
                        receiptResponse.message = "Could not find receiptId";
                        resultStatusCode = HttpStatusCode.InternalServerError;

                    }
                }
                else
                {
                    receiptResponse.isSuccess = false;
                    receiptResponse.message = "could not parse request object";
                    resultStatusCode = HttpStatusCode.BadRequest;
                }
            }
            catch (Exception e)
            {
                receiptResponse.isSuccess = false;
                resultStatusCode = HttpStatusCode.InternalServerError;
            }


            string responseString = JsonSerializer.Serialize(receiptResponse);


            HttpResponseData response = req.CreateResponse(resultStatusCode);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(responseString);

            return response;
        }

        [Function("AddUserItem")]
        public async Task<HttpResponseData> AddUserItem([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");
            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {
                var mongoClient = new MongoClient(settings);

                var db = mongoClient.GetDatabase("receiptStorage");
                var _receipts = db.GetCollection<Receipt>("receipts");


                AddUserItemRequest? model = await req.ReadFromJsonAsync<AddUserItemRequest>();
                

                if (model != null)
                {
                    Receipt receipt = _receipts.Find(x => x.receiptId == model.receiptId).First();
                    if (receipt != null)
                    {
                        User? user = receipt.users.Find(x => x.userId == model.userId);

                        if(user != null)
                        {

                            

                            Item? receiptItem = receipt.items.Find(x => x.itemId == model.itemId);

                            if(receiptItem != null)
                            {
                                Claim claim = new Claim();
                                claim.quantity = model.quantity;
                                claim.userId = model.userId;
                                receiptItem.claims.Add(claim);

                                var filter = Builders<Receipt>.Filter.Eq(x => x.receiptId, receipt.receiptId) & Builders<Receipt>.Filter.ElemMatch(x => x.items, Builders<Item>.Filter.Eq(x => x.itemId, receiptItem.itemId));

                                var update = Builders<Receipt>.Update.Set(x => x.items.FirstMatchingElement().claims, receiptItem.claims);
                           
        
                                var updateReceipt = await _receipts.UpdateOneAsync(filter, update);

                                receiptResponse.isSuccess = true;
                                receiptResponse.receipt = receipt;
                            }
                            else
                            {
                                receiptResponse.isSuccess = false;
                                receiptResponse.message = "Could not find receipt item in receipt";
                                resultStatusCode = HttpStatusCode.InternalServerError;
                            }

                            
                        }
                        else
                        {
                            receiptResponse.isSuccess = false;
                            receiptResponse.message = "Could not find userId in receipt";
                            resultStatusCode = HttpStatusCode.InternalServerError;
                        }

                    }
                    else
                    {
                        receiptResponse.isSuccess = false;
                        receiptResponse.message = "Could not find receiptId";
                        resultStatusCode = HttpStatusCode.InternalServerError;
                    }
                }
                else
                {
                    receiptResponse.isSuccess = false;
                    receiptResponse.message = "could not parse request object";
                    resultStatusCode = HttpStatusCode.BadRequest;
                }
            }
            catch (Exception e)
            {
                receiptResponse.isSuccess = false;
                resultStatusCode = HttpStatusCode.InternalServerError;
            }


            string responseString = JsonSerializer.Serialize(receiptResponse);


            HttpResponseData response = req.CreateResponse(resultStatusCode);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(responseString);

            return response;
        }

        [Function("UpdateUserItem")]
        public async Task<HttpResponseData> UpdateUserItem([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");
            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {
                var mongoClient = new MongoClient(settings);

                var db = mongoClient.GetDatabase("receiptStorage");
                var _receipts = db.GetCollection<Receipt>("receipts");


                AddUserItemRequest? model = await req.ReadFromJsonAsync<AddUserItemRequest>();


                if (model != null)
                {
                    Receipt receipt = _receipts.Find(x => x.receiptId == model.receiptId).First();
                    if (receipt != null)
                    {
                        User? user = receipt.users.Find(x => x.userId == model.userId);

                        if (user != null)
                        {



                            Item? receiptItem = receipt.items.Find(x => x.itemId == model.itemId);

                            if (receiptItem != null)
                            {


                                Claim? claim = receiptItem.claims.Find(x => x.userId == model.userId);
                                if(claim != null)
                                {
                                    claim.quantity = model.quantity;


                                    var filter = Builders<Receipt>.Filter.Eq(x => x.receiptId, receipt.receiptId) & Builders<Receipt>.Filter.ElemMatch(x => x.items, Builders<Item>.Filter.Eq(x => x.itemId, receiptItem.itemId));

                                    var update = Builders<Receipt>.Update.Set(x => x.items.FirstMatchingElement().claims, receiptItem.claims);


                                    var updateReceipt = await _receipts.UpdateOneAsync(filter, update);

                                    receiptResponse.isSuccess = true;
                                    receiptResponse.receipt = receipt;
                                }
                                else
                                {
                                    receiptResponse.isSuccess = false;
                                    receiptResponse.message = "Could not find claim in receipt item for user";
                                    resultStatusCode = HttpStatusCode.InternalServerError;
                                }
                               
                            }
                            else
                            {
                                receiptResponse.isSuccess = false;
                                receiptResponse.message = "Could not find receipt item in receipt";
                                resultStatusCode = HttpStatusCode.InternalServerError;
                            }


                        }
                        else
                        {
                            receiptResponse.isSuccess = false;
                            receiptResponse.message = "Could not find userId in receipt";
                            resultStatusCode = HttpStatusCode.InternalServerError;
                        }

                    }
                    else
                    {
                        receiptResponse.isSuccess = false;
                        receiptResponse.message = "Could not find receiptId";
                        resultStatusCode = HttpStatusCode.InternalServerError;
                    }
                }
                else
                {
                    receiptResponse.isSuccess = false;
                    receiptResponse.message = "could not parse request object";
                    resultStatusCode = HttpStatusCode.BadRequest;
                }
            }
            catch (Exception e)
            {
                receiptResponse.isSuccess = false;
                resultStatusCode = HttpStatusCode.InternalServerError;
            }


            string responseString = JsonSerializer.Serialize(receiptResponse);


            HttpResponseData response = req.CreateResponse(resultStatusCode);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(responseString);

            return response;
        }

        [Function("GetUserTotals")]
        public async Task<HttpResponseData> GetUserTotals([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");
            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {
                var mongoClient = new MongoClient(settings);

                var db = mongoClient.GetDatabase("receiptStorage");
                var _receipts = db.GetCollection<Receipt>("receipts");


                AddUserItemRequest? model = await req.ReadFromJsonAsync<AddUserItemRequest>();


                if (model != null)
                {
                    Receipt receipt = _receipts.Find(x => x.receiptId == model.receiptId).First();
                    if (receipt != null)
                    {
                        User? user = receipt.users.Find(x => x.userId == model.userId);

                        if (user != null)
                        {



                            Item? receiptItem = receipt.items.Find(x => x.itemId == model.itemId);

                            if (receiptItem != null)
                            {


                                Claim? claim = receiptItem.claims.Find(x => x.userId == model.userId);
                                if (claim != null)
                                {
                                    claim.quantity = model.quantity;


                                    var filter = Builders<Receipt>.Filter.Eq(x => x.receiptId, receipt.receiptId) & Builders<Receipt>.Filter.ElemMatch(x => x.items, Builders<Item>.Filter.Eq(x => x.itemId, receiptItem.itemId));

                                    var update = Builders<Receipt>.Update.Set(x => x.items.FirstMatchingElement().claims, receiptItem.claims);


                                    var updateReceipt = await _receipts.UpdateOneAsync(filter, update);

                                    receiptResponse.isSuccess = true;
                                    receiptResponse.receipt = receipt;
                                }
                                else
                                {
                                    receiptResponse.isSuccess = false;
                                    receiptResponse.message = "Could not find claim in receipt item for user";
                                    resultStatusCode = HttpStatusCode.InternalServerError;
                                }

                            }
                            else
                            {
                                receiptResponse.isSuccess = false;
                                receiptResponse.message = "Could not find receipt item in receipt";
                                resultStatusCode = HttpStatusCode.InternalServerError;
                            }


                        }
                        else
                        {
                            receiptResponse.isSuccess = false;
                            receiptResponse.message = "Could not find userId in receipt";
                            resultStatusCode = HttpStatusCode.InternalServerError;
                        }

                    }
                    else
                    {
                        receiptResponse.isSuccess = false;
                        receiptResponse.message = "Could not find receiptId";
                        resultStatusCode = HttpStatusCode.InternalServerError;
                    }
                }
                else
                {
                    receiptResponse.isSuccess = false;
                    receiptResponse.message = "could not parse request object";
                    resultStatusCode = HttpStatusCode.BadRequest;
                }
            }
            catch (Exception e)
            {
                receiptResponse.isSuccess = false;
                resultStatusCode = HttpStatusCode.InternalServerError;
            }


            string responseString = JsonSerializer.Serialize(receiptResponse);


            HttpResponseData response = req.CreateResponse(resultStatusCode);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(responseString);

            return response;
        }

    }
}
