import React from "react";
import './message.css';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ReactHtmlParser from 'react-html-parser';

function Message({data,icon}) {
        
    return (
      <>
      {
        data.map(({ sender, msg }, idx) => (
         
            
            
         <div className ='messege_continer' key={idx}>
        
         
            <div className = "user_iconDiv">
            {icon?
            <p>image</p>
            :
                <AccountBoxIcon/>
            }
        </div>
        <div className = 'MassegeText_continer'>
         <strong>{sender}</strong>
         <div className = "massage_text">{ReactHtmlParser(msg)}</div>
        </div>
      
        
      </div>
          
        ))
      }
      
      </>
     
      
    );
  }
  
  export default Message;