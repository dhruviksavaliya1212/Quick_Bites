import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminContextProvider, { AdminContext } from './Context/AdminContext'
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
    <App />
    </AdminContextProvider>
  </BrowserRouter>,
)
