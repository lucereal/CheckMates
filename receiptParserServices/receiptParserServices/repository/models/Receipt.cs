using MongoDB.Bson.Serialization.Attributes;
using receiptParserServices.domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.repository.model
{
    internal class Receipt
    {
        public Receipt()
        {
            items = new List<Item>();
            users = new List<User>();
        }

        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRepresentation(MongoDB.Bson.BsonType.String)]
        public string receiptId { get; set; }

        [BsonRepresentation(MongoDB.Bson.BsonType.Double)]
        public double total { get; set; }
        
        [BsonRepresentation(MongoDB.Bson.BsonType.Double)]
        public double tip { get; set; }
        [BsonRepresentation(MongoDB.Bson.BsonType.String)]
        public string merchantName { get; set; }

        [BsonRepresentation(MongoDB.Bson.BsonType.DateTime)]
        public DateTimeOffset transactionDate { get; set; }


        public List<User> users { get; set; }
        

        public List<Item> items { get; set; }

       
        
    }
}
