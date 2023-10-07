using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.domain
{
    internal class ReceiptRequest
    {
        public List<ItemDto> items {  get; set; } = new List<ItemDto>();
        
        public double total { get; set; }
        public double tip { get; set; }
        public string merchantName {  get; set; } = string.Empty;

        DateTimeOffset transactionDate { get; set; }

        [JsonProperty("id", NullValueHandling = NullValueHandling.Ignore)]
        public string id { get; set; }

        public List<UserDto> users { get; set; } = new List<UserDto>();

    }
}
