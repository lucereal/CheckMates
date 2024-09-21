const signalR = require("@microsoft/signalr");

let connectionId = "";
let connection = new signalR.HubConnectionBuilder()
    .withUrl("https://receiptparserdevelop001.azurewebsites.net/chatHub")
    //.withUrl("http://localhost:5197/chatHub")
    .build();

connection.on("ReceiveMessage", (user, message) => {
    // Handle incoming messages
    console.log("received message: " + message);
});

connection.on("UserAdded", (user, message) => {
    // Handle incoming messages
    console.log("User added: " + user);
});

connection.on("UserItemAdded", (receiptResponse) => {
    console.log("user item added success: "  + receiptResponse.isSuccess);
})

connection.on("GroupReceiptUpdate", (receiptDto) => {
    console.log("receipt updated: " );
    console.log(receiptDto);
    connection.invoke("GroupUpdateReceived", receiptDto._id, connection.connectionId)

})

connection.on("GroupUpdate", (message) => {
    // Handle incoming messages
    console.log("group update: " + message);
    // {
    //     "id":"66cb60abdb69f7b5c245ae64",
    //     "userId":"v0QLohJH",
    //     "itemId":"2",
    //     "quantity": 1
    // }
    // var addUserItem = {
    //     id: "66cb60abdb69f7b5c245ae64", userId: "v0QLohJH", itemId: "9", quantity: 1
    // }
    // connection.invoke("AddUserItem", JSON.stringify(addUserItem));
    connection.invoke("GroupUpdateReceived", connection.connectionId)


});

connection.start().then(() => {
    // Connection to the hub is established
    console.log("connection established");
    console.log("connection id: " + connection.connectionId);
    let user = "david";
    //connection.invoke("AddUser", user, "message");
    
    connection.invoke("AddUserConnectionId", "66ee139195317a88e7778e8c");

    

});

connection.onclose(() => {
    console.log("closing connection");

    //connection.invoke("CloseUserConnection", "66cb60abdb69f7b5c245ae64", "v0QLohJH");

})


