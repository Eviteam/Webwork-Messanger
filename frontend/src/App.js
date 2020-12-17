import React, { useEffect, useState} from "react";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import "./App.css"
import Header from "./Views/Header/Header"
import Sidebar from "./Views/SideBar/sideBar"
import Chat from "./Views/Chat/chat"
import {UserProvider} from './userContext';
import axios from 'axios';
function App() {
  const [userId,setUserId]= useState('')
useEffect(()=>{
  const user_id = window.location.search.slice(9)
  setUserId(user_id)
},[])
 
  
     if(userId.length){
      axios.post(`https://localhost:3000/api/current_user/${userId}`, { 
        userId
         })
      return ( 
        <UserProvider>
         <div className="App">
         <Router>
         <Header/>
          <div className="app_body">
          <Sidebar />
         <Switch>
           <Route path="/room/:roomId">
           <Chat/>
           </Route>
           <Route path="/">
             <h1>Welcome</h1>
             </Route>
         </Switch>
          </div>
         
         </Router>
       </div>
        </UserProvider>
         
     );
    
     }
     else return(null)
}

export default App;
