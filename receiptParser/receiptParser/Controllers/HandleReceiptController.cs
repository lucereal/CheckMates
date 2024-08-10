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
                    Guid receiptId = Guid.NewGuid();
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


            //string responseString = JsonSerializer.Serialize(receiptResponse);


            //HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
            //response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            //response.WriteString(responseString);

            //return response;
            return receiptResponse;
        }

        [HttpPost(Name = "GetReceipt")]
        public async Task<ReceiptResponse> GetReceipt(ReceiptRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            HttpStatusCode resultStatusCode = HttpStatusCode.OK;
            ReceiptResponse receiptResponse = new ReceiptResponse();
            receiptResponse.isSuccess = false;
            try
            {

                ReceiptRequest? model = req;//await req.ReadFromJsonAsync<ReceiptRequest>();


                if (model != null && model.id != null)
                {
                    ReceiptDto receiptDto = await _userReceiptService.GetReceipt(model.id);
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


            //string responseString = JsonSerializer.Serialize(receiptResponse);


            //HttpResponseData response = req.CreateResponse(resultStatusCode);
            //response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            //response.WriteString(responseString);

            //return response;
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



                AddUserRequest? model = req;// await req.ReadFromJsonAsync<AddUserRequest>();

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


            //string responseString = JsonSerializer.Serialize(receiptResponse);


            //HttpResponseData response = req.CreateResponse(resultStatusCode);
            //response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            //response.WriteString(responseString);

            //return response;
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


            //string responseString = JsonSerializer.Serialize(receiptResponse);


            //HttpResponseData response = req.CreateResponse(resultStatusCode);
            //response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            //response.WriteString(responseString);

            //return response;
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


            //string responseString = JsonSerializer.Serialize(receiptResponse);


            //HttpResponseData response = req.CreateResponse(resultStatusCode);
            //response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            //response.WriteString(responseString);

            //return response;
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
