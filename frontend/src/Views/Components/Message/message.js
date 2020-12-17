import React from "react";
import './message.css';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ReactHtmlParser from 'react-html-parser';

function Message({data,icon,isChannal}) {
    return (
      <>
      
      {
        data.map(({ sender, msg,message, }, idx) => (
         
            
            
         <div className ='messege_continer' key={idx}>
        
         
            <div className = "user_iconDiv">
            {icon?
            <p>image</p>
            :
                <AccountBoxIcon/>
            }
        </div>
        <div className = 'MassegeText_continer'>
        <strong>{`${sender.firstname} ${sender.lastname}`}</strong>
 
         
         {msg?<div className = "massage_text">{ReactHtmlParser(msg)}</div>:
         <div className = "massage_text">{ReactHtmlParser(message)}</div>}
        </div>
      
        
      </div>
          
        ))
      }
      
      </>
     
      
    );
  }
  
  export default Message;