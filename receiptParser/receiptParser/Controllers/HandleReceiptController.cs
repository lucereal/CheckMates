using Microsoft.AspNetCore.Mvc;
using receiptParser.Domain;
using receiptParser.Repository.mappers;
using receiptParser.Service.inter;
using receiptParser.Util.error;
using System.Collections.Generic;
using System.Net;
using System;

namespace receiptParser.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class HandleReceiptController : Controller
    {
        private readonly IUserReceiptService _userReceiptService;
        private readonly ILogger _logger;


        public HandleReceiptController(ILogger<HandleReceiptController> logger, IUserReceiptService userReceiptService)
        {
            _logger = logger;
            _userReceiptService = userReceiptService;
        }


        [HttpPost(Name = "CreateReceipt")]
        public async Task<ReceiptResponse> CreateReceipt(ReceiptRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {

                ReceiptRequest? model = req;/*await req.ReadFromJsonAsync<ReceiptRequest>();*/


                if (model != null)
                {
                    ReceiptDto receiptDto = new ReceiptDto();
                    receiptDto = model.receipt;

                    ReceiptDto resultReceiptDto = await _userReceiptService.CreateReceipt(receiptDto);

                    receiptResponse.isSuccess = true;
                    receiptResponse.message = "Receipt created.";
                    receiptResponse.receipt = resultReceiptDto;
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


            return receiptResponse;
        }

        [HttpGet("{id}")]
        public async Task<ReceiptResponse> GetReceipt(string id)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {

                //ReceiptRequest? model = req;//await req.ReadFromJsonAsync<ReceiptRequest>();


                if (id != null)
                {
                    ReceiptDto receiptDto = await _userReceiptService.GetReceipt(id);
                    receiptResponse.isSuccess = true;
                    receiptResponse.message = "Receipt fetched.";
                    receiptResponse.receipt = receiptDto;
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

            return receiptResponse;
        }

        [HttpPost(Name = "AddUsers")]
        public async Task<ReceiptResponse> AddUsers(AddUserRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();

            receiptResponse.isSuccess = false;
            try
            {

                AddUserRequest? model = req;

                if (model != null)
                {
                    ReceiptDto resultReceiptDto = await _userReceiptService.AddUsersToReceipt(model.id, model.userNames);
                    receiptResponse.isSuccess = true;
                    receiptResponse.message = "Receipt created.";

                    receiptResponse.receipt = resultReceiptDto;
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


            return receiptResponse;
        }

        [HttpPost(Name = "AddUserItem")]
        public async Task<ReceiptResponse> AddUserItem(AddUserItemRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");
            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {

                AddUserItemRequest? model = req;// await req.ReadFromJsonAsync<AddUserItemRequest>();


                if (model != null)
                {
                    ReceiptDto resultReceiptDto = await _userReceiptService.AddUserClaim(model.id, model.userId, model.itemId, model.quantity);
                    receiptResponse.isSuccess = true;
                    receiptResponse.message = "Receipt created.";

                    receiptResponse.receipt = resultReceiptDto;
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

            return receiptResponse;
        }

        [HttpPost(Name = "RemoveUserItem")]
        public async Task<ReceiptResponse> RemoveUserItem(AddUserItemRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");
            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {

                AddUserItemRequest? model = req;


                if (model != null)
                {
                    ReceiptDto resultReceiptDto = await _userReceiptService.RemoveUserClaim(model.id, model.userId, model.itemId);
                    receiptResponse.isSuccess = true;
                    receiptResponse.message = "User claim removed on receipt: " + model.id + " for user: " + model.userId + " for item: " + model.itemId;

                    receiptResponse.receipt = resultReceiptDto;
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

            return receiptResponse;
        }

        [HttpPost(Name = "UpdateUserItem")]
        public async Task<ReceiptResponse> UpdateUserItem(AddUserItemRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");
            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {

                AddUserItemRequest? model = req;// await req.ReadFromJsonAsync<AddUserItemRequest>();


                if (model != null)
                {
                    ReceiptDto resultReceiptDto = await _userReceiptService.UpdateUserClaim(model.id, model.userId, model.itemId, model.quantity);
                    receiptResponse.isSuccess = true;
                    receiptResponse.message = "Success";

                    receiptResponse.receipt = resultReceiptDto;
                }
                else
                {
                    receiptResponse.isSuccess = false;
                    receiptResponse.message = "could not parse request object";
                    resultStatusCode = HttpStatusCode.BadRequest;
                }
            }
            catch (HandleReceiptException e)
            {
                receiptResponse.isSuccess = false;
                receiptResponse.failureReason = e.failureReason;
                resultStatusCode = GetResponseStatusCodeByFailureReason(e.failureReason);
            }
            catch (Exception e)
            {
                receiptResponse.isSuccess = false;
                resultStatusCode = HttpStatusCode.InternalServerError;
            }


            return receiptResponse;
        }

        private HttpStatusCode GetResponseStatusCodeByFailureReason(HandleReceiptFailureReason failureReason)
        {
            switch (failureReason)
            {
                case HandleReceiptFailureReason.CouldNotFindReceipt: return HttpStatusCode.NotFound;
                default: return HttpStatusCode.InternalServerError;
            }
        }

    }
}
