using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.domain
{
    internal class AddUserItemRequest
    {
        public string receiptId { get; set; }
        public int userId { get; set; }

        public int itemId { get;set; }

        public int quantity { get; set; }
    }
}
