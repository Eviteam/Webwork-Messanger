import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import CKEditorMessage from "../Views/Components/Message/ckEditor"
import Message from "../Views/Components/Message/message"
import "./socetIo.css";
import axios from 'axios';
import {UseTeam} from "../userContext"
import ReactHtmlParser from 'react-html-parser';
import { teal } from "@material-ui/core/colors";
const socket = io.connect("https://localhost:3000");


function SocetIo() {
console.log(999)
  const {selectedInfo,team,userAcountData,messages} = UseTeam()
  const [sender,setSender] = useState('Ashot Amiraghyan');
  const [msg,setMsg] = useState('');
  const [chat,setChat]= useState([]);
  useEffect(()=>{
    socket.on("chatMessage", ({ sender, msg }) => {
      chat.push({ sender, msg })
      let newChat = [...chat]
      setChat(newChat);
    });
  },[]);
  
  
// useEffect(()=>{
// if(team&&team._id){
//   setSender(team._id)
// }
// },[])
  // onTextChange = e => {
  //   this.setState({ [e.target.name]: e.target.value });
  // };

  const onMessageSubmit = async (msg) => {
   
    socket.emit("chatMessage", { sender, msg });
    axios.post(`https://localhost:3000/api/chat/send-message`, { 
    receiver_id: selectedInfo.selectedUserId,
    message: msg,
    sender:userAcountData._id,
    channel:selectedInfo.isSelectChannel?selectedInfo.selectedChannelId:null
     });
     setMsg('')
    
  };
  const changeMessage = (data)=>{
    setMsg(data);
  }
 
  
    return (
      <div className = "soket_io">
        {/* <span>Nickname</span>
        <input
          name="nickname"
          onChange={e => this.onTextChange(e)}
          value={this.state.nickname}
        />
        <button onClick={this.onMessageSubmit}>Send</button> */}
        {/* <input value = {msg} onChange={e=>changeMessage(e)} onKeyDown={keyPress}></input> */}
        <CKEditorMessage message = {msg} changeMessage={changeMessage} onMessageSubmit ={onMessageSubmit}/>
        <div className = 'message_continer'>
        {
          messages.length? <Message data={messages}/>:null
        }
        {
          // chat.length? <Message data={chat}/>:null
          
        }
       
          </div>
        
          
        
        
      </div>
      
    );
}



export default SocetIo;
