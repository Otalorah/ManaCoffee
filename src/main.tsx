import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import MenuPage from './pages/MenuPage/MenuPage'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Reservations from './pages/Reservations/Reservations'
import Password from './pages/Password/Password'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/password" element={<Password />} />
        <Route path="/reservations" element={<Reservations />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
