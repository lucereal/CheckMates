using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.domain
{
    internal class Receipt
    {
        public Receipt()
        {
            items = new List<Item>();
            users = new List<User>();
        }
        public string receiptId { get; set; }
        public List<Item> items { get; set; }

        public double total { get; set; }

        public double tip { get; set; }

        public List<User> users { get; set; }

        public DateTimeOffset transactionDate { get; set; }
        public string merchantName { get; set; }

        public string _id {  get; set; }
        


    }
}
