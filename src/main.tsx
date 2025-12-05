import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import MenuPage from './pages/MenuPage/MenuPage'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Reservations from './pages/Reservations/Reservations'
import BuildYourMenu from './pages/BuildYourMenu/BuildYourMenu'
import Password from './pages/Password/Password'
import Admin from './pages/Admin/Admin'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/build-your-menu" element={<BuildYourMenu />} />
          <Route path="/password" element={<Password />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
