using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.domain
{
    internal class Claim
    {
        
        public Claim() { }
        public int userId {  get; set; }

        public int quantity { get; set; }
    }
}
