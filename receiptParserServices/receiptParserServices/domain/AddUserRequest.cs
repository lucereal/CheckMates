using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.domain
{
    internal class AddUserRequest
    {
        public string id { get; set; }
        public List<string> userNames { get; set; }
    }
}
