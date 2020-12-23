import React from "react";
import './users.css';
function User({Icon,title,id,selectUser,selected,isNewMassage}) {
    return (
      
      <div className ={id!==selected?'user':"user selected"} onClick = {()=>selectUser(id,'user')}>
        {Icon&&<Icon className = "user_icon"/>}
        {Icon? (
            <p>{title}</p>
        ):
        
        <p># {title}</p>
        }
        {/* {isNewMassage && <span className = 'message_notification'> 1 </span>} */}
        
      </div>
    );
  }
  
  export default User;