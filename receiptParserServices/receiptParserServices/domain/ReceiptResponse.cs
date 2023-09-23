using receiptParserServices.util.error;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.domain
{
    internal class ReceiptResponse
    {
        public ReceiptResponse() { }
        public bool isSuccess { get; set; }

        public string message { get; set; }
        public ReceiptDto receipt { get; set; }

        public HandleReceiptFailureReason? failureReason { get; set; }
    }
}
