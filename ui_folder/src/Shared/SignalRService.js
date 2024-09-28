import * as signalR from '@microsoft/signalr';

let connection = null;
let isInitialized = false;

class SignalRService {
    constructor() {
        if (!SignalRService.instance) {
            SignalRService.instance = this;
        }
        return SignalRService.instance;
    }

    startConnection(chatHubUrl, receiptId) {
        if (isInitialized && connection && connection.state === signalR.HubConnectionState.Connected) {
            console.log("SignalR connection already established");
            return;
        }

        if (!isInitialized) {
            console.log("signalRService starting connection with " + chatHubUrl + " and receiptId: " + receiptId);
            connection = new signalR.HubConnectionBuilder()
                .withUrl(chatHubUrl)
                .build();

            connection.start()
                .then(() => {
                    console.log("SignalR connection established");
                    console.log("addUserConnectionId with receiptId: " + receiptId + " and connectionId: " + connection.connectionId);
                    connection.invoke("AddUserConnectionId", receiptId);
                    isInitialized = true;
                })
                .catch(e => {
                    console.log("SignalR connection error: ", e);
                });
        }
    }

    stopConnection() {
        if (connection) {
            connection.stop()
                .then(() => {
                    console.log("SignalR connection stopped");
                    isInitialized = false;
                })
                .catch(e => console.log("SignalR stop connection error: ", e));
        }
    }

    getConnection() {
        return connection;
    }
}

const instance = new SignalRService();
Object.freeze(instance);

export default instance;