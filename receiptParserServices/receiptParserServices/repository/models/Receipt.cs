using MongoDB.Bson.Serialization.Attributes;
using receiptParserServices.domain;
using receiptParserServices.repository.models.impl;
using System;
using System.Collections.Generic;
using System.Linq;

using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.repository.model
{
    internal class Receipt : Document
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
