import React from "react";
import './chat.css';
import {useParams} from "react-router-dom"
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SocetIo from "../../SocketIo/socket.ioHooks"
import {UseTeam} from "../../userContext";
import Message from "../Components/Message/message"
function Chat() {
    // const {roomId} = useParams()
    const {selectedUserInfo,messages,selectedChannelInfo,} = UseTeam();
    return (
      <div className = "Chat_continer">
        <div className = "chat_header">
        <div className = "chat_headerLeft">
          <h4 className = "chat_channelName">
            {selectedUserInfo&&selectedUserInfo.id?`${selectedUserInfo.firstname} ${selectedUserInfo.lastname}`:'general'}
            <StarBorderOutlinedIcon/>
          </h4>
          </div>
          <div className = "chat_headerRight">
            <p><InfoOutlinedIcon/>Detils</p>
          </div>
        </div>
        <h2>send message to {selectedUserInfo&&selectedUserInfo.id?`${selectedUserInfo.firstname} ${selectedUserInfo.lastname}`:`${selectedChannelInfo.channelName} channel`}</h2>
        <SocetIo />
        
      </div>
    );
  }
  
  export default Chat;