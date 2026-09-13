import './App.css'
import FacialExpression from './Components/FacialExpression'
import Auth from './Components/Auth'
import Dashboard from './Components/Dashboard'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Admin from './Components/Admin'

function App() {
  const routes=createBrowserRouter([
    {
      path:"/",
      element:<FacialExpression/>
    },
    {
      path:"/wp-admin",
      element:<Admin/>
    },
    {
      path:"/login",
      element:<Auth mode="login"/>
    },
    {
      path:"/signup",
      element:<Auth mode="signup"/>
    },
    {
      path:"/dashboard",
      element:<Dashboard/>
    }
  ])

  return (
    <>
      <RouterProvider router={routes}/>
    </>
  )
}

export default App
