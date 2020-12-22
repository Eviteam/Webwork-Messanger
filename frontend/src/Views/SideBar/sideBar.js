import React,{ useState, useEffect, } from "react";
import './sideBar.css';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CreateIcon from '@material-ui/icons/Create';
import Channels from '../Components/Channel/Chanels';
import Users from '../Components/Direct Messeges/users'
import {useHistory} from "react-router-dom";
import {UseTeam} from "../../userContext"
function SideBar() {
 
    const history = useHistory();
    const {team,users,chakUser,chekChannel,userAcountData,FetchMessageData,channels,selectedInfo,FetchChannalMessageData} = UseTeam();
   
    const [isOpenChanels, setIsOpenChanels] = useState(true);
    const [isOpenUsers, setIsOpenUsers] = useState(true);
    const [selected,setSelected]= useState(0);
    const [selectedTeam,setSelectedTeam]= useState(0);
    const [generalId,setGeneralId] = useState(0) 

  
    useEffect( async()=>{
      let selectedUserId = await localStorage.getItem('selectedUserId');
      let selectedTeamId = await localStorage.getItem('selectedTeamId');
      let selectedChannelId  = await localStorage.getItem('selectedChannelId');
      setSelectedTeam(selectedTeamId)
      if(selectedUserId){
        setSelected(selectedUserId);
        chakUser(selectedUserId);
        selectHandler(selectedUserId,'user')
      }
      else if(selectedChannelId){
        setSelected(selectedChannelId);
        chekChannel(selectedChannelId);
        selectHandler(selectedChannelId,'channel')
      }
      else {
        console.log(channels)
        
          if(channels.length){
            let generalChannel = channels.find(channel=>channel.channelName === 'general');
          console.log(generalChannel);
          // setSelected(generalChannel._id);
          // chakUser(generalChannel._id);
          // localStorage.setItem('selectedChannelId',generalChannel._id)
          selectHandler(generalChannel._id,'channel')
          }
        
          
      }
    },[channels]);
    useEffect( ()=>{
     
      if(selectedInfo.isSelectedUser){
        FetchMessageData(selectedTeam,selected)
      }
      if(selectedInfo.isSelectChannel){
        FetchChannalMessageData(selectedTeam,selected)
      }
      
    },[selectedTeam]);
    const changeChanalsStatus = ()=>{
      setIsOpenChanels(!isOpenChanels)
    }
    const changeUsersStatus = ()=>{
      setIsOpenUsers(!isOpenUsers)
    }
    const selectHandler = (id,type)=>{
      if(id){
        
        history.push(`/room/${id}`);
        setSelected(id);
       
        
        if(type==='channel' ){
          console.log(id,'channel')
          chekChannel(id)
          console.log(id,'channel');
          localStorage.setItem('selectedChannelId',id);
          localStorage.removeItem('selectedUserId');
          FetchChannalMessageData(selectedTeam,selected)
            
        };
        if(type==='user' && team.team_id){
          console.log(id,'user');
          chakUser(id);
          localStorage.setItem('selectedUserId',id);
          localStorage.removeItem('selectedChannelId');
          FetchMessageData(team.team_id,id)
        }
      }
     
    }
    return (
      <div className = "sidebar">
          <div className = "sidebar_header">
              <div className = "sidebar_info">
              <h2>{team&&team.team_name?team.team_name:''}</h2>
                <h3>
                    <FiberManualRecordIcon/>
                    {userAcountData&&userAcountData.firstname?`${userAcountData.firstname} ${userAcountData.lastname}`:''}
                </h3>
              </div>
                <CreateIcon/>
          </div>
          
               <Channels isOpenChanels = {isOpenChanels} channels = {channels} changeChanalsStatus = {changeChanalsStatus} selectChannel={selectHandler} selected ={selected} />
               <Users isOpenUsers = {isOpenUsers} users = {users?users:[]} changeUsersStatus = {changeUsersStatus} selectUser={selectHandler} selected ={selected}/>
      </div>
    );
  }
  
  export default SideBar;