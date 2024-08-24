using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Util.error
{
    [Serializable]
    public class HandleReceiptException : Exception
    {
        public HandleReceiptFailureReason failureReason;
        public HandleReceiptException() {
            failureReason = HandleReceiptFailureReason.Unknown;
        }
        public HandleReceiptException(string message, HandleReceiptFailureReason failureReason) : base(message) {
            this.failureReason = failureReason;
        }

        public HandleReceiptException(string message, Exception innerException, HandleReceiptFailureReason failureReason) : base(String.Format("Handling Receipt failed with reason: {0} and message: {1}", failureReason,message), innerException) {
            this.failureReason=failureReason;
        }

        
    }
}
