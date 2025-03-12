import { Route, Routes } from "react-router-dom";

import SignIn from '../pages/SignIn';
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Private from './Private.js';
import Profile from "../pages/Profile";
import Customers from "../pages/Customers";
import New from "../pages/New/index.js";

function RoutesApp(){
    return(
        //Rota Default "*" 
        <Routes> 

            <Route path="/" element={ <SignIn /> } />
            <Route path="/register" element={ <SignUp /> } />
            
            <Route path="/new" element={ <Private> <New /> </Private> } />
            <Route path="/new/:id" element={ <Private> <New /> </Private> } />
            <Route path="/customers" element={<Private> <Customers /> </Private>}/>
            <Route path="/dashboard" element={ <Private> <Dashboard/> </Private> }/>
            <Route path="/profile" element={<Private> <Profile /> </Private>}/>
        </Routes>
    )
}

export default RoutesApp;