using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Repository.models
{
    public class Item
    {
        public Item()
        {
            claims = new List<Claim>();
        }

        public int itemId { get; set; }
        public string description { get; set; }
        public double price { get; set; }

        public double quantity { get; set; }

        public List<Claim> claims { get; set; }
    }
}
