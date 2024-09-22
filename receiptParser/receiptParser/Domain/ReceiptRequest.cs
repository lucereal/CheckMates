using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Domain
{
    public class ReceiptRequest
    {

        [JsonProperty("id")]
        public string? id { get; set; }


        public ReceiptDto receipt { get; set; }

    }
}
