import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import CKEditorMessage from "../Views/Components/Message/ckEditor"
import Message from "../Views/Components/Message/message"
import "./socetIo.css";
import axios from 'axios';
import {UseTeam} from "../userContext"
const socket = io.connect("https://localhost:3000");


function SocetIo() {

  const {team,userAcountData,messages,channalMesseges,FetchMessageData,selectedInfo,FetchChannalMessageData,users,ChangeUsers} = UseTeam()
  // const [sender,setSender] = useState('');
  const [msg,setMsg] = useState('');
  // const [chat,setChat]= useState([]);
  // const[selectedChannel,setSelectedChannel]= useState('');
  // const[selectedUserId,setSelectedUser]= useState('')
  useEffect(()=>{
  
    socket.on("chatMessage", async({ sender, msg,receiver }) => {
      
     const channelId =  await localStorage.getItem('selectedChannelId');
     const userLongId =  await localStorage.getItem('user_long_id');
     const teamId =  await localStorage.getItem('selectedTeamId');
    //  console.log(sender,userId);
    if(channelId){
           FetchChannalMessageData(teamId,channelId)
    }
    else{
      console.log(receiver,'receiver');
        // await FetchMessageData(teamId,sender);
        
        // if(receiver === channelId){
        //   console.log(5555555555555)
        //   ChangeUsers(users,sender)
        // }
        
          
    }
      // chat.push({ sender, msg })
      // // let newChat = [...chat]
      // // setChat(newChat);
      // //  FetchMessageData(team.team_id,sender)
      
      
    });
   
  },[users,]);
  
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
    const teamId =  await localStorage.getItem('selectedTeamId');
    let sender = userAcountData._id;
    const receiver =  await localStorage.getItem('selectedUserId') 
    await socket.emit("chatMessage", {msg,sender,receiver });
     const channelId =  await localStorage.getItem('selectedChannelId');
     const userId =  await localStorage.getItem('selectedUserId') 
    if(channelId){
      await axios.post(`https://localhost:3000/api/chat/send-message/channel`, { 
        channel_id: channelId,
        message: msg,
        user_id:userAcountData._id,
        receiver_id:null,
        team_id:teamId
         });
      // sendChannelMessage(msg,info)
           setMsg('')
           FetchChannalMessageData(team.team_id,userId)
    }
    else{
     
     
     await axios.post(`https://localhost:3000/api/chat/send-message`, { 
        receiver_id: receiver,
        message: msg,
        sender:userAcountData._id,
        channel_id:null,
        team_id:teamId
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
