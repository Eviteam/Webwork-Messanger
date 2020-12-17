import React, { useState,useEffect,useCallback, useContext, useReducer } from "react";
import axios from 'axios';
const TeamContext = React.createContext();

export const  UseTeam= ()=>{
    return useContext(TeamContext)
}
const Select_User = 'selectUser';
const Selec_Channel = 'selectChannel';
const Take_messages = 'takeMessages'
const Take_Channal_Messages = 'takeChannalMessages'

const selectUserReducer = (state,action)=> {
    switch (action.type){
        case Select_User:return{...state,isSelectedUser:true,selectedUserId:action.id,isSelectChannel:false,selectedChannelId:''};
        case Selec_Channel:return{...state,isSelectChannel:true,selectedChannelId:action.id,isSelectedUser:false,selectedUserId:'',};
        case Take_messages:return{...state,messages:action.data};
        case Take_Channal_Messages:return{...state,channalMesseges:action.data}
        default:return state
    }
}
// const directMessageReducer = (state,action)=> {
//   switch (action.type){
//       case Take_messages:return{...state,messages:action.payload}
//       default:return state
//   }
// }
export const UserProvider = ({children})=>{
  let [responseData, setResponseData] = useState(null);
  let [usersData,setUsersData]= useState([]);
  let [channelsData,setChannelsData]= useState([]);
  let [userAcountData, setUserAcountData] = useState(null);
  const [selectedTeam,setSelectedTeam]= useState(null);
  const [selectedInfo,dispach]= useReducer(selectUserReducer,{
    isSelectedUser:false,
    selectedUserId:"",
    isSelectChannel:false,
    selectedChannelId:"",
    messages:[],
    channalMesseges:[]
})
// const [directMessage,dispach]= useReducer(selectUserReducer,{
 
// })
const chakUser = (id)=>dispach({
    type:Select_User,
    id
})
const chekChannel = (id)=>{
 
  dispach({
    type:Selec_Channel,
    id
});
}
const FetchMessageData = useCallback ((team_id,recevier_id) => {
  

    axios({
      "method": "GET",
      "url": `https://localhost:3000/api/chat/${team_id}/${recevier_id}`,
    })
    .then((response) =>{
     
      let data = response.data

      dispach({
        type:Take_messages,
        data
      })
    } )
    .catch((error) => {
      console.log(error)
      
    })
  
  
}, []);
const FetchChannalMessageData = useCallback ((team_id,Channal_id) => {
  // console.log(777777777,Channal_id)
  axios({
    "method": "GET",
    "url": `https://localhost:3000/api/channel/message/${Channal_id}`,
  })
  .then((response) =>{
   
    let data = response.data
    dispach({
      type:Take_Channal_Messages,
      data
    })
  } )
  .catch((error) => {
    console.log(error)
    
  })


}, []);
  const fetchData = useCallback(() => {
    axios({
      "method": "GET",
      "url": "https://localhost:3000/api/team/71",
    })
    .then((response) => {
      setResponseData(response.data)
     
      let id = response.data.user_id;
      setSelectedTeam(response.data.team[0].team_id)

      localStorage.setItem('selectedTeamId',response.data.team[0].team_id)
      fetchChannelsData(response.data.team[0].team_id)
      axios({
        "method": "GET",
        "url": `https://localhost:3000/api/users/${id}`,
      })
      .then((response) => {
       
        setUserAcountData(response.data)
      })
      .catch((error) => {
        console.log(error)
        
      })
    })
    .catch((error) => {
      console.log(error)
      
    })
  }, []);
  const fetchUsersData = useCallback(() => {
    axios({
      "method": "GET",
      "url": "https://localhost:3000/api/users",
    })
    .then((response) => {
      setUsersData(response.data)
    })
    .catch((error) => {
      console.log(error)
      
    })
  }, []);
  const fetchChannelsData = useCallback((selectedTeam) => {
   
    axios({
      "method": "GET",
      "url": `https://localhost:3000/api/channel/${selectedTeam}`,
    })
    .then((response) => {
      
      setChannelsData(response.data)
      
    })
    .catch((error) => {
      console.log(error)
      
    })
  }, [])
  
    
  
useEffect( () => {
    fetchData();
    fetchUsersData();   
  }, [fetchData,fetchUsersData,]);
    


    return(
            <TeamContext.Provider 
            value = {
                {
                   team:responseData?
                   {   createdAt:responseData.team[0].createdAt,
                       team_id:responseData.team[0].team_id,
                       team_name:responseData.team[0].team_name,
                       updatedAt:responseData.team[0].updatedAt,
                       _id:responseData.team[0]._id,
                       user_id:responseData.user_id,
                   }:{},
                   users:responseData?usersData:[],
                   channels:channelsData,
                   userAcountData:userAcountData?userAcountData[0]:[],
                   selectedInfo:{
                    isSelectedUser:selectedInfo.isSelectedUser,
                    selectedUserId:selectedInfo.selectedUserId,
                    isSelectChannel:selectedInfo.isSelectChannel,
                    selectedChannelId:selectedInfo.selectedChannelId,
                    
                   },chakUser,chekChannel,FetchMessageData,FetchChannalMessageData,
                   selectedUserInfo:selectedInfo.isSelectedUser&&usersData?usersData.find(users => users._id==selectedInfo.selectedUserId):{},
                   selectedChannelInfo:selectedInfo.isSelectChannel&&channelsData.length?channelsData.find(channel => channel._id==selectedInfo.selectedChannelId):{},
                   messages:selectedInfo.messages,
                   channalMesseges:selectedInfo.channalMesseges
                   
                }
              }>
                {children}
            </TeamContext.Provider>
    )
}