# ReceiptSplit

**Demo**: [ReceiptSplit Demo](https://lemon-tree-0c66a350f.5.azurestaticapps.net/)

## Description

ReceiptSplit is a web application that allows users to upload a picture of a receipt to split the tab with friends. It is particularly useful when one person pays for a meal for a group, and everyone needs to figure out how much money to send the person who paid.

## How It Works

- **Frontend**: The frontend application is built with React.
- **Backend**: The backend API is developed using ASP.NET Core.
- **Database**: The application uses a MongoDB database.
- **Infrastructure**: All infrastructure is hosted on Azure.
- **Receipt Parsing**: The Azure Document Intelligence service is used to parse the receipt.
- **Real-Time Collaboration**: SignalR is set up in both the frontend and backend to allow real-time server-side events using WebSockets. This enables multiple people to edit the same receipt in real-time.

## Future Functionality

- **Payment Service Integrations**: Plans to integrate with payment services such as Venmo, CashApp, Zelle, and more.


## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

    
