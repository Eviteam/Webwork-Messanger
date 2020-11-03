import React from "react";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import "./App.css"
import Header from "./Views/Header/Header"
import Sidebar from "./Views/SideBar/sideBar"
import Chat from "./Views/Chat/chat"
function App() {
  return (
    <div className="App">
      <Router>
      <Header/>
       <div className="app_body">
       <Sidebar/>
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
  );
}

export default App;
