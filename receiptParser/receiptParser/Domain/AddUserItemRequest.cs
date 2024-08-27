using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Domain
{
    public class AddUserItemRequest
    {
        public string id { get; set; }
        public string userId { get; set; }

        public int itemId { get;set; }

        public int quantity { get; set; }
    }
}
