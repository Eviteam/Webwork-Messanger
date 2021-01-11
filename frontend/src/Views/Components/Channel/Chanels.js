import React, { useState } from "react";
import './channel.css';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import GroupIcon from '@material-ui/icons/Group';
import Channel from './channel'
import AddIcon from '@material-ui/icons/Add';
import {Modal,TextField,Button} from '@material-ui/core/';
import axios from 'axios';
import {UseTeam} from "../../../userContext";
import FixedOptions  from "../Selector/selector"
// import CreatChannelModal from '../Modals/CreatChannelModal'
function Channels({isOpenChanels,channels,changeChanalsStatus,selectChannel,selected,}) {
  const {fetchChannelsData,users} = UseTeam()
  const [isOpanCreatChannel,setIsOpanCreatChannel] = useState(false);
  const [isOpanAddUssers,setIsOpanAddUssers] = useState(false);

  const [channelName,setChannelName] = useState('');
  const [selectedUsers,setSelectedUsers]=useState([])
  const handleClose = (name)=>{
    
    setIsOpanCreatChannel(false)
  }
  const addUsers = ()=>{

  }
const createChannel = async ()=>{
  const cleanSelectedUsers = [];
  selectedUsers.map(user=>{
    cleanSelectedUsers.push(user._id)
  })
  
   await axios.post(`https://localhost:3000/api/channel/create-channel`, { 
        
            channelName: channelName,
            teamId: '71',
            'users': cleanSelectedUsers,
            isGlobal: true
          
     });
     setChannelName('');
     setIsOpanAddUssers(false);
     const teamId = await localStorage.getItem('selectedTeamId');
     console.log(fetchChannelsData)
     fetchChannelsData(teamId)
} 
 let newUsersData = []
  const addFixedKey = users.map(user=>{
    newUsersData.push({
      label:`${user.firstname} ${user.lastname}`,
      id:user.id,
      _id:user._id,
      value:`${user.firstname} ${user.lastname}`,
      firstname:user.firstname,
      lastname:user.lastname,
      isFixed:false
    })
  })
 
    return (
        <>

<Modal
  open={isOpanCreatChannel}
  onClose={handleClose}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
    <div className = 'create-channel-modal'>
    <p>Create a channel</p>
 <p>Channels are where your team communicates.</p>
 <TextField id="outlined-basic" label="name" variant="outlined" onChange = {(e)=>{setChannelName(e.target.value)}}/>
 <Button variant="contained"  onClick = {()=>{
   setIsOpanCreatChannel(false);
   setIsOpanAddUssers(true)
 }}>Create</Button>
    </div>
 
</Modal>
<Modal
  open={isOpanAddUssers}
  onClose={()=>{setIsOpanAddUssers(false)}}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
    <div className = 'create-channel-modal'>
    <p>Add ussers</p>
 
 <FixedOptions data= {newUsersData}  addUsers= {setSelectedUsers}/>
 <Button variant="contained"  onClick = {()=>{
  
   setIsOpanAddUssers(false);
   createChannel()
 }}>Create</Button>
    </div>
 
</Modal>
      <div className = "channels">
       <div className = "chanels_div">
           <span onClick = {changeChanalsStatus}>
               {isOpenChanels?<ArrowDropDownIcon className = 'arrow'/>:<ArrowRightIcon className = 'arrow'/>}
           
           </span>
           <span>
               <p>Channels</p>
           </span>
           <span className = 'AddCircleIcon_channel'>
           <AddCircleIcon/>
           </span>
       </div>
       <div className = 'channels_continer'>

            {isOpenChanels && channels.map((item,index)=>{
                    return (
                        <Channel key = {index} title = {item.channelName} Icon = {null} id = {item._id} selectChannel = {selectChannel} selected ={selected}/>
                    )
                   
                })
                }
                 {isOpenChanels?<div className = 'add_channel'>
                     <AddIcon/>
                     <p onClick = {()=>{setIsOpanCreatChannel(true)}}>Add Channel</p>
                 </div>:null}
                
       </div>
       
       
      </div>
      </>
    );
  }
  
  export default Channels;