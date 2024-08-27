using Microsoft.Extensions.Options;
using MongoDB.Driver;
using receiptParser.Repository.inter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Repository.impl
{
    public class MongoDBContext : IMongoDBContext
    {
        private IMongoDatabase _db { get; set; }
        private MongoClient _mongoClient { get; set; }
        public IClientSessionHandle Session { get; set; }
        public MongoDBContext(MongoClientSettings settings)
        {
            _mongoClient = new MongoClient(settings);
            _db = _mongoClient.GetDatabase("receipts");
        }

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return _db.GetCollection<T>(name);
        }
    }
}
