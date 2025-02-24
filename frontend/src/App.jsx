import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Home from './components/Home'
import BulkSend from './components/BulkSend'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/send-bulk' element={<BulkSend />}></Route>
      </Routes>

    </BrowserRouter>
  )
}

export default App
