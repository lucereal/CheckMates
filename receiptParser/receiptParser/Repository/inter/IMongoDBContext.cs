using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Repository.inter
{
    public interface IMongoDBContext
    {
        IMongoCollection<Book> GetCollection<Book>(string name);
    }
}
