import React from "react";
import './chat.css';
import {useParams} from "react-router-dom"
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SocetIo from "../../SocketIo/socket.ioHooks"
import {UseTeam} from "../../userContext"
function Chat() {
    const {roomId} = useParams()
    const {selectedUserInfo} = UseTeam();
    console.log(selectedUserInfo)
    return (
      <div className = "Chat_continer">
        <div className = "chat_header">
        <div className = "chat_headerLeft">
          <h4 className = "chat_channelName">
            {selectedUserInfo.id?`${selectedUserInfo.firstname} ${selectedUserInfo.lastname}`:'general'}
            <StarBorderOutlinedIcon/>
          </h4>
          </div>
          <div className = "chat_headerRight">
            <p><InfoOutlinedIcon/>Detils</p>
          </div>
        </div>
        <h2>send message to {selectedUserInfo.id?`${selectedUserInfo.firstname} ${selectedUserInfo.lastname}`:'Gagul'}</h2>
        <SocetIo/>
      </div>
    );
  }
  
  export default Chat;