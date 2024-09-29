import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import Head from 'next/head';
import * as serviceWorker from './serviceWorkerRegistration';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


console.log("NODE_ENV: " + process.env.NODE_ENV);
console.log("Secret Key: " + process.env.REACT_APP_SECRET_KEY);
console.log("API URL: " + process.env.REACT_APP_BACKEND_API_URL);

// Layout Component
// const Layout = ({ children }) => {
//     return (
//         <>
//             <Head>
//                 <title>My PWA</title>
//                 <meta name="viewport" content="width=device-width, initial-scale=1" />
//                 <link rel="manifest" href="/manifest.json" />
//                 <link rel="icon" href="/favicon.ico" />
//                 <meta name="theme-color" content="#000000" />
//             </Head>
//             <header>
//                 {/* Add your header content here */}
//             </header>
//             <main>
//                 {children}
//             </main>
//             <footer>
//                 {/* Add your footer content here */}
//             </footer>
//         </>
//     );
// };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        
            <App />
        
    </React.StrictMode>
);

serviceWorker.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
