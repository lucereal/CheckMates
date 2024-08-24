using MongoDB.Bson.Serialization.Attributes;
using receiptParser.Domain;
using receiptParser.Repository.models;
using System;
using System.Collections.Generic;
using System.Linq;
using receiptParser.Util.attributes;

using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Repository.model
{
    [BsonCollection("receipts")]
    public class Receipt : Document
    {
        public Receipt()
        {
            items = new List<Item>();
            users = new List<User>();
        }

        
        public string receiptId { get; set; }
      
        public double total { get; set; }
        
        public double tip { get; set; }

        public string merchantName { get; set; }

        public DateTimeOffset transactionDate { get; set; }

        public List<User> users { get; set; }     

        public List<Item> items { get; set; }

       
        
    }
}
