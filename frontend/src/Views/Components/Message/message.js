import React, { useEffect, useState } from "react";
import './message.css';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';
import {ReactComponent as UserIcon} from '../../Icons/UserIcon.svg';
function Message({data,icon,isChannal}) {
  const [userId,setUserId]= useState('');
  useEffect(()=>{
    let id = localStorage.getItem('user_id');
    setUserId(id)
  },[])
  console.log(data)
    return (
      <>
      
      {
        
        data.map(({ sender, msg,message,createdAt}, idx) =>
         
         {
           console.log(sender[0]._id,userId)
           if(sender[0].id !=userId)
           {
             return (
              <div className ='messege_continer' key={idx}>
              <div className ='sender-info'>
              <p className= 'sender-name'>{`${sender[0].firstname} ${sender[0].lastname}`}</p> 
              <span className = 'time'>{`${moment(createdAt).format('MM-DD')} at ${moment(createdAt).format('h mm')}`}</span>
              </div>
              
            
               
           <div className = 'massegeText_continer'>
           <div className = "user_iconDiv">
               {icon?
               <p>image</p>
               :
                   <UserIcon className = 'UserIcon-message'/>
               }
           </div>
            
            {msg?<div className = "massage_text">{ReactHtmlParser(msg)}</div>:
            <div className = "massage_text">{ReactHtmlParser(message)}</div>}
           </div>
         
           
         </div>
         
             )
           }
           else return (
            <div className ='messege_continer-2' key={idx}>
            <div className ='sender-info-2'>
           
            <p className= 'sender-name-2'>{`${sender[0].firstname} ${sender[0].lastname}`}</p>
            <span className = 'time-2'>{`${moment(createdAt).format('MM-DD')} at ${moment(createdAt).format('h mm')}`}</span>
            </div>
            
          

         <div className = 'massegeText_continer-2'>
         {/* <div className = "user_iconDiv-2">
             {icon?
             <p>image</p>
             :
                 <UserIcon className = 'UserIcon-message-2'/>
             }
         </div> */}
          
          {msg?<div className = "massage_text-2 ">{ReactHtmlParser(msg)}</div>:
          <div className = "massage_text-2">{ReactHtmlParser(message)}</div>}
         </div>
       
         
       </div>
           )
         
         }
          
         
          
        )
      }
      
      </>
     
      
    );
  }
  
  export default Message;