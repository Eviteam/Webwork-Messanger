import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import CKEditorMessage from "../Views/Components/Message/ckEditor"
import Message from "../Views/Components/Message/message"
import "./socetIo.css";
import axios from 'axios';
import {UseTeam} from "../userContext"
const socket = io.connect("https://localhost:3000");


function SocetIo() {

  const {team,userAcountData,messages,channalMesseges,FetchMessageData,selectedInfo,FetchChannalMessageData} = UseTeam()
  // const [sender,setSender] = useState('');
  const [msg,setMsg] = useState('');
  // const [chat,setChat]= useState([]);
  // const[selectedChannel,setSelectedChannel]= useState('');
  // const[selectedUserId,setSelectedUser]= useState('')
  useEffect(()=>{
  
    socket.on("chatMessage", async({ sender, msg }) => {
      console.log(sender);
      const channelId =  await localStorage.getItem('selectedChannelId');
     const userId =  await localStorage.getItem('selectedUserId') 
    if(channelId){
           FetchChannalMessageData(team.team_id,channelId)
    }
    else{
     
        FetchMessageData(team.team_id,userId)
    }
      // chat.push({ sender, msg })
      // // let newChat = [...chat]
      // // setChat(newChat);
      // //  FetchMessageData(team.team_id,sender)
    });
   
  },[]);
  
  // const sendUserMessage = useCallback((mess,info) => {
  //   // console.log(info)
  //   axios.post(`https://localhost:3000/api/chat/send-message`, { 
  //       receiver_id: info.selectedUserId,
  //       message: mess,
  //       sender:userAcountData._id,
  //       channel:info.isSelectChannel?info.selectedChannelId:null
  //        });
  // },[selectedInfo]);
  // const sendChannelMessage = useCallback((mess,info) => {
  //   console.log(mess,info,'mess,info')
    //  axios.post(`https://localhost:3000/api/chat/send-message/channel`, { 
    //       channel_id:  info.selectedChannelId,
    //       message: mess,
    //       user_id:userAcountData._id,
    //        });
  // },[])
   

  const onMessageSubmit = async (msg,info) => {
    
    let sender = userAcountData._id;
    await socket.emit("chatMessage", {msg,sender });
     const channelId =  await localStorage.getItem('selectedChannelId');
     const userId =  await localStorage.getItem('selectedUserId') 
    if(channelId){
      await axios.post(`https://localhost:3000/api/chat/send-message/channel`, { 
        channel_id: channelId,
        message: msg,
        user_id:userAcountData._id,
         });
      // sendChannelMessage(msg,info)
           setMsg('')
           FetchChannalMessageData(team.team_id,channelId)
    }
    else{
     
     
     await axios.post(`https://localhost:3000/api/chat/send-message`, { 
        receiver_id: userId,
        message: msg,
        sender:userAcountData._id,
        channel:null
         });
         setMsg('');
        FetchMessageData(team.team_id,userId)
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
