using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.repository.inter
{
    internal interface IMongoDBContext
    {
        IMongoCollection<Book> GetCollection<Book>(string name);
    }
}
