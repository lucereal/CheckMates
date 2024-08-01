using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Domain
{
    internal class ItemDto
    {
        public ItemDto()
        {
            claims = new List<ClaimDto>();
        }

        public int itemId { get; set; }
        public string description {  get; set; }
        public double price { get; set; }

        public double quantity { get; set; }

        public List<ClaimDto> claims { get; set; }
    }
}
