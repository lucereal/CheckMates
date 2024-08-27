using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Domain
{
    public class ReceiptDto
    {
        public ReceiptDto()
        {
            items = new List<ItemDto>();
            users = new List<UserDto>();
        }
        public string receiptId { get; set; }
        public List<ItemDto> items { get; set; }

        public double total { get; set; }

        public double tip { get; set; }

        public List<UserDto> users { get; set; }

        public DateTimeOffset transactionDate { get; set; }
        public string merchantName { get; set; }

        public string _id {  get; set; }
        


    }
}
