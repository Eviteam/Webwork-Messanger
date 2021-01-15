import React from "react";
import './users.css';
import {ReactComponent as UserIcon} from '../../Icons/UserIcon.svg';
function User({Icon,title,id,selectUser,selected,isNewMassage}) {
  
    return (
      
      <div className ={id!=selected?'user':"user selected"} onClick = {()=>selectUser(id,'user')}>
        {Icon&&<UserIcon className = "user_icon"/>}
        {Icon? (
            <p>{title}</p>
        ):
        
        <p>{title}</p>
        }
        {/* {isNewMassage && <span className = 'message_notification'> 1 </span>} */}
        <span className = 'is-online'></span>
      </div>
    );
  }
  
  export default User;