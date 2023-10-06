import InputComponent from './Components/InputComponent'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

const routes = createBrowserRouter([
    {
      path: "/",
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
