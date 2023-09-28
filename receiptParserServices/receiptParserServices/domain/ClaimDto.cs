using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.domain
{
    internal class ClaimDto
    {
        
        public ClaimDto() { }
        public string userId {  get; set; }

        public int quantity { get; set; }

        public double total { get; set; }   
    }
}
