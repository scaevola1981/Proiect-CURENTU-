import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { MateriiPrimeProvider } from './LocalStorage/MateriiPrimeContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MateriiPrimeProvider>
    <App />
    </MateriiPrimeProvider>
  </StrictMode>
)
