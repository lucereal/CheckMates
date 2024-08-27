using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Util.error
{
    public enum HandleReceiptFailureReason
    {
        Unknown, ModelParsingIssue, DataRetrievalIssue, CouldNotAddClaim, CouldNotFindUserOrItem, CouldNotFindReceipt

    }
}
