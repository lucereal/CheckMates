using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Domain
{
    public class ClaimDto
    {
        
        public ClaimDto() { }
        public string userId {  get; set; }

        public int quantity { get; set; }

        public double total { get; set; }   
    }
}
