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
  let[currentUserSavedId,setCurrentUserSavedId]=useState(null)
  const [selectedTeam,setSelectedTeam]= useState(0);
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
const FetchMessageData = useCallback (async (team_id,recevier_id) => {
 
  const CurrentUserId = await localStorage.getItem('user_id');
  console.log('currentUserSavedId',CurrentUserId)
  
    axios({
      "method": "GET",
      "url": `https://localhost:3000/api/chat/${team_id}/${CurrentUserId}/${recevier_id}`,
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
  const fetchData = useCallback((savedTeamID) => {
    if(savedTeamID){
      console.log('asds')
      axios({
        "method": "GET",
        "url": `https://localhost:3000/api/team/${savedTeamID}`,
      })
      .then(async (response) => {
        setResponseData(response.data)
       
        let id = await localStorage.getItem('user_id')
        fetchChannelsData(savedTeamID)
        axios({
          "method": "GET",
          "url": `https://localhost:3000/api/users/${id}`,
        })
        .then((response) => {
         console.log(response.data,5555)
         
          setUserAcountData(response.data)
        })
        .catch((error) => {
          console.log(error)
          
        })
      })
      .catch((error) => {
        console.log(error)
        
      })
    }
  
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
   
  const fetchChannelsData = (selectedTeam) => {
   
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
  };
    
  
useEffect( async() => {
  
  if(selectedTeam){
    console.log(selectedTeam,2);
   const id= await localStorage.getItem('selectedTeamId')
    if (id){
      await fetchData(id);
      await fetchUsersData(); 
    }
    
  }
  // const CurrentUserId = await localStorage.getItem('user_id');
  //   console.log('currentUserSavedId',CurrentUserId)
  //   setCurrentUserSavedId(CurrentUserId)
    // fetchData();
    // fetchUsersData(); 
    // console.log(selectedTeam,1);

  }, [selectedTeam]);
    
useEffect(async()=>{
  const savedTeam = await localStorage.getItem('selectedTeamId');
  if(savedTeam){
    console.log(savedTeam)
    setSelectedTeam(savedTeam);
     
  }
  
},[])

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
                    
                   },fetchData,chakUser,chekChannel,FetchMessageData,FetchChannalMessageData,fetchChannelsData,
                   selectedUserInfo:selectedInfo.isSelectedUser&&usersData?usersData.find(users => users._id===selectedInfo.selectedUserId):{},
                   selectedChannelInfo:selectedInfo.isSelectChannel&&channelsData.length?channelsData.find(channel => channel._id===selectedInfo.selectedChannelId):{},
                   messages:selectedInfo.messages,
                   channalMesseges:selectedInfo.channalMesseges
                   
                }
              }>
                {children}
            </TeamContext.Provider>
    )
}