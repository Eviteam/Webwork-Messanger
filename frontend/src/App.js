import React, { useEffect, useState} from "react";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import "./App.css"
import Header from "./Views/Header/Header"
import Sidebar from "./Views/SideBar/sideBar"
import Chat from "./Views/Chat/chat"
import {UserProvider} from './userContext';
import axios from 'axios';
import {UseTeam} from "./userContext";
function App() {
  const [userId,setUserId]= useState('');
  const [isRenderApp,setIsRenderApp] = useState(false)

useEffect( async()=>{
  const savedId = await localStorage.getItem('user_id');
  if(savedId){
    setUserId(savedId)
  }
  else{
    const user_id = window.location.search.slice(9)
    setUserId(user_id);
  }
  
},[]);
useEffect(()=>{
  if(userId.length && !isRenderApp){axios.post(`http://localhost:3000/api/current_user/${userId}`, {
         }).then((response)=>{
          
           if(response.data ){
             console.log(response.data);
             setUserId(response.data.user_id);
             localStorage.setItem('selectedTeamId',response.data.team[0].team_id);
             localStorage.setItem('user_id',response.data.user_id);
            setIsRenderApp(true)
           }
         })
        }
},[userId])
  
     if(isRenderApp){

      return ( 
        <UserProvider>
         <div className="App">
         <Router>
         {/* <Header/> */}
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
