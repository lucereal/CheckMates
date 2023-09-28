using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.util.error
{
    internal enum HandleReceiptFailureReason
    {
        Unknown, ModelParsingIssue, DataRetrievalIssue, CouldNotAddClaim, CouldNotFindUserOrItem, CouldNotFindReceipt

    }
}
