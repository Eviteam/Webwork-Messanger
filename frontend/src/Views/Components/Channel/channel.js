import React,{} from "react";
import './channel.css';
import {ReactComponent as ChannelIcon} from '../../Icons/GeneralIcon.svg';
function Channel({Icon,title,id,selectChannel,selected}) {
  
  
    return (
      <div className = {id!==selected?"channel":"channel selected"} onClick = {()=>{
        selectChannel(id,'channel');
      }}>
        {/* {Icon&&<Icon className = "channel_icon"/>} */}
        {Icon? (
            <p>{title}</p>
        ):
        <>
          <ChannelIcon className = "channel-icon"/>
        <p>{title}</p>
       </>
       
        }
      </div>
    );
  }
  
  export default Channel;