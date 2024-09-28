import React, { createContext, useContext, useEffect, useState } from 'react';
import signalRService from './SignalRService';

const SignalRContext = createContext();

export const SignalRProvider = ({ children, chatHubUrl, receiptId }) => {
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        
        console.log("signalRProvider starting connection with " + chatHubUrl + " and receiptId: " + receiptId);
        console.log(signalRService)
        signalRService.startConnection(chatHubUrl, receiptId);
        setConnection(signalRService.getConnection());

        return () => {
            signalRService.stopConnection();
        };
    }, [chatHubUrl, receiptId]);

    return (
        <SignalRContext.Provider value={connection}>
            {children}
        </SignalRContext.Provider>
    );
};

export const useSignalR = () => {
    return useContext(SignalRContext);
};