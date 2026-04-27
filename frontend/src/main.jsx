import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Auth from './pages/Auth/Auth.jsx';
import App from './App.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import RightPanel from './components/RightPanel.jsx';



import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
