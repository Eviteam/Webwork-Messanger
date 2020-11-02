import React from "react";
import './chat.css';
import {useParams} from "react-router-dom"
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SocetIo from "../../SocketIo/socket.io"
function Chat() {
    const {roomId} = useParams()
    return (
      <div className = "Chat_continer">
        <div className = "chat_header">
        <div className = "chat_headerLeft">
          <h4 className = "chat_channelName">
            <strong># general</strong>
            <StarBorderOutlinedIcon/>
          </h4>
          </div>
          <div className = "chat_headerRight">
            <p><InfoOutlinedIcon/>Detils</p>
          </div>
        </div>
        <h2>you are in the {roomId} room</h2>
        <SocetIo/>
      </div>
    );
  }
  
  export default Chat;