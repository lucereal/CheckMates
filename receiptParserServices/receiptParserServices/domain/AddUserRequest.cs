using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.domain
{
    internal class AddUserRequest
    {
        public string receiptId { get; set; }
        public User user { get; set; }
    }
}
