using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Repository.models
{
    public class Document : IDocument
    {
        public ObjectId _id { get; set; }

        public DateTime CreatedAt => _id.CreationTime;
    }
}
