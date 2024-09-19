using MongoDB.Driver.Core.Configuration;
using MongoDB.Driver;
using receiptParser.Repository.impl;
using receiptParser.Repository.inter;
using receiptParser.Service.impl;
using receiptParser.Service.inter;
using receiptParser.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
string connectionString = @"mongodb://receiptstorage:dlJPotZLpCSxRAkF97PRD48aUmtqyjTnVVhFuWU5pvviiyngNdAkScyqOc2DlBSsfm3AiQAy83KcACDbuNIecg==@receiptstorage.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@receiptstorage@";


builder.Services.AddCors();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IUserReceiptService, UserReceiptService>();
builder.Services.AddScoped(typeof(IMongoRepository<>), typeof(MongoRepository<>));
builder.Services.AddSingleton<IMongoDBContext>(new MongoDBContext(MongoClientSettings.FromUrl(new MongoUrl(connectionString))));

builder.Services.AddSignalR();
    //.AddJsonProtocol();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder =>
{
    //builder.AllowAnyOrigin()
    //       .AllowAnyMethod()
    //       .AllowAnyHeader();
    builder.AllowAnyMethod()
       .AllowAnyHeader()
       .AllowCredentials()
       .WithOrigins("http://localhost:3000");
});


app.UseRouting();
app.UseAuthorization();


#pragma warning disable ASP0014 // Suggest using top level route registrations
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ChatHub>("/chatHub");
});
#pragma warning restore ASP0014 // Suggest using top level route registrations




app.Run();
