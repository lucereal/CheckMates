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
using receiptParserServices.repository.inter;
using receiptParserServices.repository.model;
using Receipt = receiptParserServices.repository.model.Receipt;
using receiptParserServices.util.error;
using System.Runtime.CompilerServices;
using receiptParserServices.repository.mappers;
using receiptParserServices.service.inter;
using MongoDB.Bson.IO;
using Newtonsoft.Json.Linq;

namespace receiptParserServices
{
    internal class HandleReceipt
    {
        private readonly ILogger _logger;

        private readonly IReceiptRepository _receiptRepository;
        private readonly IUserReceiptService _userReceiptService;

        public HandleReceipt(ILoggerFactory loggerFactory, IReceiptRepository receiptRepository, IUserReceiptService userReceiptService)
        {
            _logger = loggerFactory.CreateLogger<ParseReceipt>();
            _receiptRepository = receiptRepository;
            _userReceiptService = userReceiptService;
        }

        [Function("CreateReceipt")]
        public async Task<HttpResponseData> CreateReceipt([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {

                ReceiptRequest? model = await req.ReadFromJsonAsync<ReceiptRequest>();


                if (model != null)
                {
                    Guid receiptId = Guid.NewGuid();
                    Receipt receipt = new Receipt();
                    receipt.total = model.total;
                    receipt.tip = model.tip;
                    receipt.items = ReceiptMapper.MapItemDtosToItems(model.items);
                    receipt.merchantName = model.merchantName;
                    receipt.receiptId = receiptId.ToString();

                    Receipt resultReceipt = await _receiptRepository.createReceipt(receipt);

                    ReceiptDto receiptDto = ReceiptMapper.MapReceiptToReceiptDto(resultReceipt);
                    
                    receiptResponse.isSuccess = true;
                    receiptResponse.message = "Receipt created.";
                    
                    receiptResponse.receipt = receiptDto;
                }
                else
                {
                    receiptResponse.isSuccess = false;
                    receiptResponse.failureReason = HandleReceiptFailureReason.ModelParsingIssue;
                    receiptResponse.message = "";
                    
                }
            }
            catch(HandleReceiptException e)
            {
                receiptResponse.isSuccess = false;
                receiptResponse.failureReason = e.failureReason;
                receiptResponse.message = e.Message;
            }
            catch(Exception e)
            {
                receiptResponse.isSuccess = false;
                receiptResponse.message = e.Message;
                receiptResponse.failureReason = HandleReceiptFailureReason.Unknown;
                
            }


            string responseString = JsonSerializer.Serialize(receiptResponse);


            HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(responseString);

            return response;
        }

        [Function("GetReceipt")]
        public async Task<HttpResponseData> GetReceipt([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {

                string? model = await req.ReadAsStringAsync();


                if (model != null)
                {
                    
                    JObject modelObj = JObject.Parse(model);
                    string? id = (string)modelObj["id"];

                    if(id != null)
                    {

                        Receipt resultReceipt = await _receiptRepository.getReceiptById(id);

                        ReceiptDto receiptDto = ReceiptMapper.MapReceiptToReceiptDto(resultReceipt);

                        receiptResponse.isSuccess = true;
                        receiptResponse.message = "Receipt created.";

                        receiptResponse.receipt = receiptDto;
                    }
                    else
                    {
                        receiptResponse.isSuccess = false;
                        receiptResponse.failureReason = HandleReceiptFailureReason.CouldNotFindReceipt;
                        resultStatusCode = HttpStatusCode.BadRequest;

                    }
                    
                   
                }
                else
                {
                    receiptResponse.isSuccess = false;
                    receiptResponse.failureReason = HandleReceiptFailureReason.ModelParsingIssue;
                    receiptResponse.message = "";

                }
            }
            catch (HandleReceiptException e)
            {
                receiptResponse.isSuccess = false;
                receiptResponse.failureReason = e.failureReason;
                receiptResponse.message = e.Message;
            }
            catch (Exception e)
            {
                receiptResponse.isSuccess = false;
                receiptResponse.message = e.Message;
                receiptResponse.failureReason = HandleReceiptFailureReason.Unknown;

            }


            string responseString = JsonSerializer.Serialize(receiptResponse);


            HttpResponseData response = req.CreateResponse(resultStatusCode);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(responseString);

            return response;
        }

        [Function("AddUsers")]
        public async Task<HttpResponseData> AddUsers([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();

            receiptResponse.isSuccess = false;
            try
            {
                


                AddUserRequest? model = await req.ReadFromJsonAsync<AddUserRequest>();

                if (model != null)
                {
                    Receipt resultReceipt = await _userReceiptService.AddUsersToReceipt(model.id, model.userNames);
                    receiptResponse.isSuccess = true;
                    receiptResponse.message = "Receipt created.";

                    receiptResponse.receipt = ReceiptMapper.MapReceiptToReceiptDto(resultReceipt);
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
               
                AddUserItemRequest? model = await req.ReadFromJsonAsync<AddUserItemRequest>();


                if (model != null)
                {
                    Receipt resultReceipt = await _receiptRepository.addUserClaimToReceipt(model.id, model.userId, model.itemId, model.quantity, null);
                    receiptResponse.isSuccess = true;
                    receiptResponse.message = "Receipt created.";

                    receiptResponse.receipt = ReceiptMapper.MapReceiptToReceiptDto(resultReceipt);
                }
                else
                {
                    receiptResponse.isSuccess = false;
                    receiptResponse.message = "Could not parse request object";
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
                
                AddUserItemRequest? model = await req.ReadFromJsonAsync<AddUserItemRequest>();


                if (model != null)
                {
                    Receipt resultReceipt = await _userReceiptService.UpdateUserClaim(model.id, model.userId, model.itemId, model.quantity);
                    receiptResponse.isSuccess = true;
                    receiptResponse.message = "Receipt created.";

                    receiptResponse.receipt = ReceiptMapper.MapReceiptToReceiptDto(resultReceipt);
                }
                else
                {
                    receiptResponse.isSuccess = false;
                    receiptResponse.message = "could not parse request object";
                    resultStatusCode = HttpStatusCode.BadRequest;
                }
            }
            catch(HandleReceiptException e)
            {
                receiptResponse.isSuccess = false;
                receiptResponse.failureReason = e.failureReason;
                resultStatusCode = HttpStatusCode.InternalServerError;
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


        //[Function("GetUserTotals")]
        //public async Task<HttpResponseData> GetUserTotals([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        //{
        //    _logger.LogInformation("C# HTTP trigger function processed a request.");
        //    HttpStatusCode resultStatusCode = HttpStatusCode.OK;
        //    ReceiptResponse receiptResponse = new ReceiptResponse();
        //    receiptResponse.isSuccess = false;
        //    try
        //    {
        //        var mongoClient = new MongoClient(settings);

        //        var db = mongoClient.GetDatabase("receiptStorage");
        //        var _receipts = db.GetCollection<Receipt>("receipts");


        //        AddUserItemRequest? model = await req.ReadFromJsonAsync<AddUserItemRequest>();


        //        if (model != null)
        //        {
        //            Receipt receipt = _receipts.Find(x => x.receiptId == model.receiptId).First();
        //            if (receipt != null)
        //            {
        //                User? user = receipt.users.Find(x => x.userId == model.userId);

        //                if (user != null)
        //                {



        //                    Item? receiptItem = receipt.items.Find(x => x.itemId == model.itemId);

        //                    if (receiptItem != null)
        //                    {


        //                        Claim? claim = receiptItem.claims.Find(x => x.userId == model.userId);
        //                        if (claim != null)
        //                        {
        //                            claim.quantity = model.quantity;


        //                            var filter = Builders<Receipt>.Filter.Eq(x => x.receiptId, receipt.receiptId) & Builders<Receipt>.Filter.ElemMatch(x => x.items, Builders<Item>.Filter.Eq(x => x.itemId, receiptItem.itemId));

        //                            var update = Builders<Receipt>.Update.Set(x => x.items.FirstMatchingElement().claims, receiptItem.claims);


        //                            var updateReceipt = await _receipts.UpdateOneAsync(filter, update);

        //                            receiptResponse.isSuccess = true;
        //                            receiptResponse.receipt = receipt;
        //                        }
        //                        else
        //                        {
        //                            receiptResponse.isSuccess = false;
        //                            receiptResponse.message = "Could not find claim in receipt item for user";
        //                            resultStatusCode = HttpStatusCode.InternalServerError;
        //                        }

        //                    }
        //                    else
        //                    {
        //                        receiptResponse.isSuccess = false;
        //                        receiptResponse.message = "Could not find receipt item in receipt";
        //                        resultStatusCode = HttpStatusCode.InternalServerError;
        //                    }


        //                }
        //                else
        //                {
        //                    receiptResponse.isSuccess = false;
        //                    receiptResponse.message = "Could not find userId in receipt";
        //                    resultStatusCode = HttpStatusCode.InternalServerError;
        //                }

        //            }
        //            else
        //            {
        //                receiptResponse.isSuccess = false;
        //                receiptResponse.message = "Could not find receiptId";
        //                resultStatusCode = HttpStatusCode.InternalServerError;
        //            }
        //        }
        //        else
        //        {
        //            receiptResponse.isSuccess = false;
        //            receiptResponse.message = "could not parse request object";
        //            resultStatusCode = HttpStatusCode.BadRequest;
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        receiptResponse.isSuccess = false;
        //        resultStatusCode = HttpStatusCode.InternalServerError;
        //    }


        //    string responseString = JsonSerializer.Serialize(receiptResponse);


        //    HttpResponseData response = req.CreateResponse(resultStatusCode);
        //    response.Headers.Add("Content-Type", "application/json; charset=utf-8");

        //    response.WriteString(responseString);

        //    return response;
        //}

    }
}
