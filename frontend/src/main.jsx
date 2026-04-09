import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Auth from './pages/Auth/Auth.jsx';
import App from './App.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import RightPanel from './components/RightPanel.jsx';



const router = createBrowserRouter([
  {
    path: "/", Component: App,
    children: [
      { path: "/chat", Component: ChatWindow },
      { path: "/settings", Component: RightPanel },
    ]
  },
  { path: "/login", Component: Auth },
  { path: "/register", Component: Auth },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
