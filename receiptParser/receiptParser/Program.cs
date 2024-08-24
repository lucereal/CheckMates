using MongoDB.Driver.Core.Configuration;
using MongoDB.Driver;
using receiptParser.Repository.impl;
using receiptParser.Repository.inter;
using receiptParser.Service.impl;
using receiptParser.Service.inter;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
string connectionString = @"mongodb://receiptstorage:dlJPotZLpCSxRAkF97PRD48aUmtqyjTnVVhFuWU5pvviiyngNdAkScyqOc2DlBSsfm3AiQAy83KcACDbuNIecg==@receiptstorage.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@receiptstorage@";


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//builder.Services.AddScoped<IMyDependency, MyDependency>();
builder.Services.AddScoped<IUserReceiptService, UserReceiptService>();
builder.Services.AddScoped(typeof(IMongoRepository<>), typeof(MongoRepository<>));
//builder.Services.AddScoped(IMongoDBContext<>, MongoDBContext<>)();
//services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddSingleton<IMongoDBContext>(new MongoDBContext(MongoClientSettings.FromUrl(new MongoUrl(connectionString))));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
