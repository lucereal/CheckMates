import MainContainer from './Components/MainContainer'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainContainer />,
    }
  ]);

function App() {
    return (
        <div className="app-container">
            <RouterProvider router={routes} />
        </div>
    );
}

export default App;
