# CheckMates

**Demo**: [CheckMates Demo](https://lemon-tree-0c66a350f.5.azurestaticapps.net/)

## Description

CheckMates is a web application that allows users to upload a picture of a receipt to split the tab with friends. It is particularly useful when one person pays for a meal for a group, and everyone needs to figure out how much money to send the person who paid.

## How It Works

- **Frontend**: The frontend application is built with React and MUI styling framework.
- **Backend**: The backend API is developed using ASP.NET Core.
- **Database**: The application uses a MongoDB database.
- **Infrastructure**: All infrastructure is hosted on Azure.
- **Receipt Parsing**: The Azure Document Intelligence service is used to parse the receipt.
- **Real-Time Collaboration**: SignalR is set up in both the frontend and backend to allow real-time server-side events using WebSockets. This enables multiple people to edit the same receipt in real-time.

## Future Functionality

- **Payment Service Integrations**: Plans to integrate with payment services such as Venmo, CashApp, Zelle, and more.
- **Progressive Web App Enhancements**: App is confiured as a PWA but we should implement versioning so app is updated and make sure the icon shows up. 
- **Custom Domain**: Custom Domain
- **Receipt Collections**: Allow users to group receipts to split all amoung friends
- **Manual Receipt**: Allow users to create manual receipt, user adds each item. 

## Fixes Needed

- **Improved SignalR**: SignalR set up is basic and sometimes requires rejoining the receipt with the code in order to see the real time updates. 



## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

    
