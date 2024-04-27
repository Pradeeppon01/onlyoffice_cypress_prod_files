import logo from './logo.svg';
import './App.css';
import Login from './Login/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter, Link, Route, Routes, useLocation} from "react-router-dom"
import Admin from './Adminpage/Admin';
import Addtask from './Employeepage/Addtasks';
import Viewtask from './Employeepage/Viewtask';
import Adduser from './Adminpage/Adduser';
import Addmachines from './Adminpage/Addmachines';

function App() {
  return (
  
    <>
    <ToastContainer position='top-center' />
    <Routes>
       


        <Route path='/' element={<Login />} ></Route>
        <Route path='/addtask/:username' element={<Addtask />} ></Route>
        <Route path='/viewtask/:username' element={<Viewtask />} ></Route>



        <Route path='/admin/:username' element={<Admin />}></Route>
        <Route path='/adduser/:username' element={<Adduser />}></Route>
        <Route path='/addmachines/:username' element={<Addmachines />}></Route>
    </Routes>
    
    </>
  );
}

export default App;
