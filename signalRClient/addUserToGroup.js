const signalR = require("@microsoft/signalr");

let connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5197/chatHub")
    .build();


connection.on("UserAddedToGroup", (group, user, message) => {
    // Handle incoming messages
    console.log("User added to group: " + group + " " + user);
    connection.invoke("RemoveUserFromGroup", group, user, message);
});

connection.on("GroupUpdate", (message) => {
    // Handle incoming messages
    console.log("Received group update" + message);
    
});

connection.start().then(() => {
    // Connection to the hub is established
    console.log("connection established");
    let user = "david";
    connection.invoke("AddUserToGroup", "FZZRTT", user, "message");
});


