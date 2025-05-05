import React from 'react'
import SignupComponent from './compontes/signup'
import Login from './compontes/login'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import DashboardLayout from './page/DashboardLayout'
const App = () => {
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignupComponent />} />
        <Route path='/dashboard/*' element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App