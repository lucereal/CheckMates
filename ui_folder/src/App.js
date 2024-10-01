import InputComponent from './Components/InputComponent'
import MainContainer from './Components/MainComponent';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";


const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainContainer />,
    },
    {
        path: "/input",
        element: <InputComponent />,
      },
    {
        path: "/receipt",
        element: <div><h1>NEW</h1></div>,
    },
  ]);


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {
    return (
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <div className="app-container">
          
            <RouterProvider router={routes} />
        </div>
        </ThemeProvider>
    );
}

export default App;
