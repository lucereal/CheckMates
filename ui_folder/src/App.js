import InputComponent from './Components/InputComponent'
import MainContainer from './Components/MainComponent';
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

function App() {
    return (
        <div className="app-container">
            <RouterProvider router={routes} />
        </div>
    );
}

export default App;
