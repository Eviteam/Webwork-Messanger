import React from "react";
import './message.css';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ReactHtmlParser from 'react-html-parser';

function Message({data,icon,isChannal}) {


   console.log(data,)
  
    return (
      <>
      
      {
        
        data.map(({ sender, msg,message}, idx) => (
         
          // console.log(msg,message),
            
         <div className ='messege_continer' key={idx}>
        
         
            <div className = "user_iconDiv">
            {icon?
            <p>image</p>
            :
                <AccountBoxIcon/>
            }
        </div>
        <div className = 'massegeText_continer'>
        <strong>{`${sender[0].firstname} ${sender[0].lastname}`}</strong>
 
         
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