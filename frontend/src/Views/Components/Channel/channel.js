import React,{useState} from "react";
import './channel.css';
function Channel({Icon,title,id,selectChannel,selected}) {
  
    return (
      <div className = {id!==selected?"channel":"channel selected"} onClick = {()=>{
        selectChannel(id);
      }}>
        {Icon&&<Icon className = "channel_icon"/>}
        {Icon? (
            <h3>{title}</h3>
        ):
        <h3># {title}</h3>
        }
      </div>
    );
  }
  
  export default Channel;