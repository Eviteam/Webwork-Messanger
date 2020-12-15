import React,{ useState,useContext, useEffect, useCallback } from "react";
import axios from 'axios';
import './sideBar.css';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CreateIcon from '@material-ui/icons/Create';
import Channels from '../Components/Channel/Chanels';
import Users from '../Components/Direct Messeges/users'
import GroupIcon from '@material-ui/icons/Group';
import {useHistory} from "react-router-dom";
import {UseTeam} from "../../userContext"
function SideBar() {
 
    const history = useHistory();
    const {team,users,chakUser,chekChannel,userAcountData,FetchMessageData,channels,selectedInfo,FetchChannalMessageData} = UseTeam();
   
    const [isOpenChanels, setIsOpenChanels] = useState(true);
    const [isOpenUsers, setIsOpenUsers] = useState(true);
    const [selected,setSelected]= useState(0);
    const [selectedTeam,setSelectedTeam]= useState(0);

  
    useEffect( ()=>{
      let selectedUserId = localStorage.getItem('selectedUserId');
      let selectedTeamId = localStorage.getItem('selectedTeamId');
      let selectedChannelId = localStorage.getItem('selectedChannelId');
      setSelectedTeam(selectedTeamId)
      if(selectedUserId){
        setSelected(selectedUserId);
        chakUser(selectedUserId);
      }
      if(selectedChannelId){
        setSelected(selectedChannelId);
        chekChannel(selectedChannelId)
      }
    },[]);
    useEffect( ()=>{
      console.log(selectedInfo,'selectedInfo')
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
       
        
        if(type==='channel'){
          console.log(id,'channel')
          chekChannel(id)
          console.log(id,'channel');
          localStorage.setItem('selectedChannelId',id);
          localStorage.removeItem('selectedUserId');
          FetchChannalMessageData(team.team_id,id)
        };
        if(type==='user'){
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
              <h2>{team&&team.team_name}</h2>
                <h3>
                    <FiberManualRecordIcon/>
                    {userAcountData?`${userAcountData.firstname} ${userAcountData.lastname}`:'Gagulik'}
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