using MongoDB.Bson.Serialization.Attributes;
using receiptParser.Domain;
using receiptParser.Repository.models;
using System;
using System.Collections.Generic;
using System.Linq;
using receiptParser.Util.attributes;

using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Repository.models
{
    [BsonCollection("receipts")]
    public class Receipt : Document
    {
        public Receipt()
        {
            items = new List<Item>();
            users = new List<User>();
            connectionIds = new List<string>();
        }

        
        //public string receiptId { get; set; }
      
        public double total { get; set; }
        
        public double tip { get; set; }

        public double tax { get; set; }

        public string merchantName { get; set; }

        public DateTimeOffset transactionDate { get; set; }

        public List<User> users { get; set; }     

        public List<Item> items { get; set; }

        public List<string> connectionIds { get; set; }

        public Receipt originalReceipt { get; set; }

        public Receipt createCopy()
        {
            return (Receipt)this.MemberwiseClone();
        }

       
        
    }
}
