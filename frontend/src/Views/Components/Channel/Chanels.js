import React from "react";
import './channel.css';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Channel from './channel'
import AddIcon from '@material-ui/icons/Add';
function Channels({isOpenChanels,channels,changeChanalsStatus,selectChannel,selected}) {
  
    return (
      <div className = "channels">
       <div className = "chanels_div">
           <span onClick = {changeChanalsStatus}>
               {isOpenChanels?<ArrowDropDownIcon/>:<ArrowRightIcon/>}
           
           </span>
           <span>
               <h3>Channels</h3>
           </span>
           <span className = 'AddCircleIcon'>
           <AddCircleIcon/>
           </span>
       </div>
       <div className = 'channels_continer'>

            {isOpenChanels && channels.map((item,index)=>{
                    return (
                        <Channel key = {index} title = {item.channelName} Icon = {item.icon} id = {item._id} selectChannel = {selectChannel} selected ={selected}/>
                    )
                   
                })
                }
                 {isOpenChanels?<div className = 'add_channel'>
                     <AddIcon/>
                     <h3>Add Channel</h3>
                 </div>:null}
                
       </div>
       
       
      </div>
    );
  }
  
  export default Channels;