import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import CKEditorMessage from "../Views/Components/Message/ckEditor"
import Message from "../Views/Components/Message/message"
import "./socetIo.css";
import axios from 'axios';
import {UseTeam} from "../userContext"
const socket = io.connect("https://localhost:3000");


function SocetIo() {

  const {selectedInfo,team,userAcountData,messages,channalMesseges,FetchMessageData} = UseTeam()
  // const [sender,setSender] = useState('');
  const [msg,setMsg] = useState('');
  const [chat,setChat]= useState([]);
  const[selectedChannel,setSelectedChannel]= useState('')
  useEffect(()=>{
    console.log(selectedInfo.selectedChannelId,selectedInfo.selectedUserId,'11111')
    socket.on("chatMessage", ({ sender, msg }) => {
      // chat.push({ sender, msg })
      // let newChat = [...chat]
      // setChat(newChat);
      FetchMessageData(team.team_id,sender)
    });
   
  },[]);
  
useEffect(()=>{
 
  setSelectedChannel(selectedInfo.selectedChannelId)
  },[selectedInfo.selectedChannelId]);

  const onMessageSubmit = async (msg) => {
    let sender = userAcountData._id;
    socket.emit("chatMessage", { sender, msg });
    if(selectedInfo.isSelectChannel){
      // console.log(selectedInfo.selectedChannelId)
        axios.post(`https://localhost:3000/api/chat/send-message/channel`, { 
          channel_id:  selectedChannel,
          message: msg,
          user_id:userAcountData._id,
           });
           setMsg('')
     
    }
    else{
      // console.log(selectedInfo.selectedUserId)
      axios.post(`https://localhost:3000/api/chat/send-message`, { 
        receiver_id: selectedInfo.selectedUserId,
        message: msg,
        sender:userAcountData._id,
        channel:selectedInfo.isSelectChannel?selectedInfo.selectedChannelId:null
         });
         setMsg('');
         FetchMessageData(team.team_id,selectedInfo.selectedUserId)
    }
    
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
              selectedInfo &&selectedInfo.isSelectChannel?
              channalMesseges.length? <Message data={channalMesseges} isChannal={true}/>:null
               :messages.length? <Message data={messages}/>:null
                
            }  
          </div>      
      </div>
      
    );
}



export default SocetIo;
