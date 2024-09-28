using Microsoft.AspNetCore.Mvc;
using receiptParser.Domain;
using receiptParser.Repository.mappers;
using receiptParser.Service.inter;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Azure;
using HttpMultipartParser;
using Newtonsoft.Json;
using Azure.AI.FormRecognizer.Models;

namespace receiptParser.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ParseReceiptController : ControllerBase
    {
        private readonly IUserReceiptService _userReceiptService;
        string endpoint = "https://muonreceiptparser.cognitiveservices.azure.com/";
        string apiKey = "de3591828f28412fa6c0ed24499a6c8e";
        

        private readonly ILogger<ParseReceiptController> _logger;

        public ParseReceiptController(ILogger<ParseReceiptController> logger, IUserReceiptService userReceiptService)
        {
            _logger = logger;
            _userReceiptService = userReceiptService;
        }


        [HttpPost(Name = "ParseReceipt")]
        
        public async Task<ReceiptResponse> ParseReceipt(ParseReceiptRequest request)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            var credential = new AzureKeyCredential(apiKey);
            var client = new DocumentAnalysisClient(new Uri(endpoint), credential);

            List<string> users = request.users;

            AnalyzeDocumentOperation? operation = null;

            IFormFile file = request.file.First();
            using (var stream = file.OpenReadStream())
            {
                operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-receipt", stream);                
            }

            ReceiptResponse responseReceipt = new ReceiptResponse();
            responseReceipt.isSuccess = true;
            
            if (operation != null) {
                AnalyzeResult receipts = operation.Value;

                string merchantName = null;
                Nullable<DateTimeOffset> transactionDate = null;
                double total = 0;
                double tip = 0;
                double tax = 0;
                List<ItemDto> items = new List<ItemDto>();

                foreach (AnalyzedDocument receipt in receipts.Documents)
                {

                    if (receipt.Fields.TryGetValue("MerchantName", out DocumentField merchantNameField))
                    {
                        if (merchantNameField.FieldType == DocumentFieldType.String)
                        {
                            merchantName = merchantNameField.Value.AsString();

                        }
                    }

                    if (receipt.Fields.TryGetValue("TransactionDate", out DocumentField transactionDateField))
                    {
                        if (transactionDateField.FieldType == DocumentFieldType.Date)
                        {
                            transactionDate = transactionDateField.Value.AsDate();

                        }
                    }
                    if (receipt.Fields.TryGetValue("Total", out DocumentField totalField))
                    {
                        if (totalField.FieldType == DocumentFieldType.Double)
                        {
                            total = totalField.Value.AsDouble();

                        }
                    }

                    if (receipt.Fields.TryGetValue("Tip", out DocumentField tipField))
                    {
                        if (tipField.FieldType == DocumentFieldType.Double)
                        {
                            tip = tipField.Value.AsDouble();

                        }
                    }

                    if (receipt.Fields.TryGetValue("TotalTax", out DocumentField taxField))
                    {
                        if (taxField.FieldType == DocumentFieldType.Double)
                        {
                            tax = taxField.Value.AsDouble();

                        }
                    }

                    if (receipt.Fields.TryGetValue("Items", out DocumentField itemsField))
                    {
                        if (itemsField.FieldType == DocumentFieldType.List)
                        {
                            foreach (DocumentField itemField in itemsField.Value.AsList())
                            {

                                if (itemField.FieldType == DocumentFieldType.Dictionary)
                                {
                                    IReadOnlyDictionary<string, DocumentField> itemFields = itemField.Value.AsDictionary();
                                    string itemDescription = null;
                                    double itemTotalPrice = 0;
                                    double itemQuantity = 0;
                                    if (itemFields.TryGetValue("Description", out DocumentField itemDescriptionField))
                                    {
                                        if (itemDescriptionField.FieldType == DocumentFieldType.String)
                                        {
                                            itemDescription = itemDescriptionField.Value.AsString();

                                        }
                                    }

                                    if (itemFields.TryGetValue("TotalPrice", out DocumentField itemTotalPriceField))
                                    {
                                        if (itemTotalPriceField.FieldType == DocumentFieldType.Double)
                                        {
                                            itemTotalPrice = itemTotalPriceField.Value.AsDouble();

                                        }
                                    }
                                    if (itemFields.TryGetValue("Quantity", out DocumentField itemQuantityField))
                                    {
                                        if (itemQuantityField.FieldType == DocumentFieldType.Double)
                                        {
                                            itemQuantity = itemQuantityField.Value.AsDouble();

                                        }
                                    }

                                    if (itemQuantity > 0)
                                    {
                                        for (int i = 0; i < itemQuantity; i++)
                                        {
                                            ItemDto item = new ItemDto();
                                            if (itemDescription != null && itemTotalPrice != null)
                                            {
                                                item.description = itemDescription;
                                                item.price = itemTotalPrice;
                                                item.quantity = 1;

                                            }
                                            items.Add(item);
                                        }
                                    }
                                    else
                                    {
                                        ItemDto item = new ItemDto();
                                        if (itemDescription != null && itemTotalPrice != null)
                                        {
                                            item.description = itemDescription;
                                            item.price = itemTotalPrice;
                                            item.quantity = 1;

                                        }
                                        items.Add(item);
                                    }

                                }
                            }
                        }
                    }

                }

                ItemDto tipItem = new ItemDto();
                tipItem.description = "Tip";
                tipItem.price = tip;
                tipItem.quantity = 1;
                items.Add(tipItem);
                
                ItemDto taxItem = new ItemDto();
                taxItem.description = "Tax";
                taxItem.price = tax;
                taxItem.quantity = 1;
                items.Add(taxItem);

                for (int i = 0; i < items.Count; i++)
                {
                    items[i].itemId = i;
                }
                List<UserDto> userDtos = ReceiptMapper.MapUserNamesToUserDtos(users);
                ReceiptDto receiptDto = new ReceiptDto();
                receiptDto.items = items;
                receiptDto.total = total;
                receiptDto.tip = tip;
                receiptDto.tax = tax;
                receiptDto.merchantName = merchantName;
                receiptDto.users = userDtos;
                if (transactionDate != null)
                {
                    receiptDto.transactionDate = transactionDate.Value;
                }

                responseReceipt.receipt = receiptDto;

            }

            //ReceiptDto resultReceiptDto = await _userReceiptService.CreateReceipt(receiptDto);

            return responseReceipt;
        }
    }
}
