import React from "react";
import './users.css';
function User({Icon,title,id,selectUser,selected}) {
  console.log(title)
    return (
      <div className ={id!==selected?"user":"user selected"} onClick = {()=>selectUser(id)}>
        {Icon&&<Icon className = "user_icon"/>}
        {Icon? (
            <h3>{title}</h3>
        ):
        <h3># {title}</h3>
        }
      </div>
    );
  }
  
  export default User;