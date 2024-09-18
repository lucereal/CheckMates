using receiptParser.Util.error;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Domain
{
    public class ReceiptResponse
    {
        public ReceiptResponse() { }
        public bool isSuccess { get; set; }

        public string message { get; set; }

        public HandleReceiptFailureReason? failureReason { get; set; }
        public ReceiptDto receipt { get; set; }

        


    }
}
