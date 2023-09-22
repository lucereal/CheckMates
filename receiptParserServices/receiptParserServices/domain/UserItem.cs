using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.domain
{
    internal class UserItem
    {
        public UserItem() { }
        public int itemId { get; set; }
        public string description { get; set; }
        public double price { get; set; }

        public int quantity { get; set; }
    }
}
