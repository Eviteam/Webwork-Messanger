import React from "react";
import './message.css';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
function Message({data}) {
        console.log(data)
    return (
      <div className ='messege_continer'>
        <div className = "user_iconDiv">
            {data&&data.icon?
            <p>image</p>
            :
                <AccountBoxIcon/>
        }
        </div>
        <div className = 'MassegeText_continer'>
         <strong>{data.nickname}</strong>
         <p className = "massage_text">{data.msg}</p>
        </div>
      </div>
    );
  }
  
  export default Message;