using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver.Core.Configuration;
using MongoDB.Driver;
using receiptParserServices.repository.impl;
using receiptParserServices.repository.inter;

string connectionString = @"mongodb://receiptstorage:dlJPotZLpCSxRAkF97PRD48aUmtqyjTnVVhFuWU5pvviiyngNdAkScyqOc2DlBSsfm3AiQAy83KcACDbuNIecg==@receiptstorage.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@receiptstorage@";

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(s =>
    {
        s.AddSingleton<IMongoDBContext>(new MongoDBContext(MongoClientSettings.FromUrl(new MongoUrl(connectionString))));
        s.AddSingleton<IReceiptRepository,ReceiptRepository>();
    })
    .Build();


host.Run();
