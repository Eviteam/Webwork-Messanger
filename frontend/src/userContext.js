import React, { useState,useEffect,useCallback, useContext, useReducer } from "react";
import axios from 'axios';
const TeamContext = React.createContext();

export const  UseTeam= ()=>{
    return useContext(TeamContext)
}
const Select_User = 'selectUser';
const Selec_Channel = 'selectChannel';
const Take_messages = 'takeMessages'
const Take_Channal_Messages = 'takeChannalMessages';
const Add_Usser = 'addUsers';
// const Change_Users = 'changeUsers'

const selectUserReducer = (state,action)=> {
    switch (action.type){
        case Select_User:return{...state,isSelectedUser:true,selectedUserId:action.id,isSelectChannel:false,selectedChannelId:''};
        case Selec_Channel:return{...state,isSelectChannel:true,selectedChannelId:action.id,isSelectedUser:false,selectedUserId:'',};
        case Take_messages:return{...state,messages:action.data};
        case Take_Channal_Messages:return{...state,channalMesseges:action.data};
        case Add_Usser :return {...state,users:action.data}
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
    channalMesseges:[],
    users:[]
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
};
const ChangeUsers = (oldData,id)=>{
  //   console.log(selectedInfo)
  //   const reseverUser = oldData.find(user=>user._id = id)
  //   const data = oldData.map(user=>{

  //     if(user._id  === id){
  //       user.isNewMassage = true
  //       return user
  //   }
  //   else return user
  // }
  //   )
  // //   dispach({
  // //     type:Selec_Channel,
  // //     data
  // // });
  //   console.log(data,'reseverUser',reseverUser);
    
};
const FetchMessageData = useCallback (async (team_id,recevier_id) => {
 console.log(team_id,recevier_id)
  const CurrentUserId = await localStorage.getItem('user_id');
 
  
    axios({
      "method": "GET",
      "url": `http://localhost:3000/api/chat/${team_id}/${CurrentUserId}/${recevier_id}`,
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
    "url": `http://localhost:3000/api/channel/message/${team_id}`,
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
  const fetchData = useCallback(async (savedTeamID) => {
    let id = await localStorage.getItem('user_id')
    
    if(savedTeamID){
     
      axios({
        "method": "GET",
        "url": `http://localhost:3000/api/team/${id}/${savedTeamID}`,
      })
      .then(async (response) => {
        console.log(response.data)
        setResponseData(response.data)
       
        
        fetchChannelsData(savedTeamID)
        // axios({
        //   "method": "GET",
        //   "url": `https://localhost:3000/api/users/${id}`,
        // })
        // .then((response) => {
        // console.log(response)
         
         
        // })
        // .catch((error) => {
        //   console.log(error)
          
        // })
      })
      .catch((error) => {
        console.log(error)
        
      })
    }
  
  }, []);
  const fetchUsersData = useCallback(async () => {
    let id = await localStorage.getItem('selectedTeamId');
    let userId = await localStorage.getItem('user_id');
    axios({
      "method": "GET",
      "url": `http://localhost:3000/api/users/${userId}`,
    })
    .then((response) => {
      let data = response.data.team.users
      console.log(response.data)
       setUsersData(response.data)
      dispach({
        type:Add_Usser,
        data
    });
           let carrentUser = data.find(user=>{ 
            return user.id == userId
             });
          setUserAcountData(carrentUser);
           localStorage.setItem('user_long_id',carrentUser._id)
    })
    .catch((error) => {
      console.log(error)
      
    })
  }, []);
   
  const fetchChannelsData = (selectedTeam) => {
   
    axios({
      "method": "GET",
      "url": `http://localhost:3000/api/channel/${selectedTeam}`,
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
    setSelectedTeam(savedTeam);
     
  }
  
},[]);

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
                   users:selectedInfo.users,
                   channels:channelsData,
                   userAcountData:userAcountData,
                   selectedInfo:{
                    isSelectedUser:selectedInfo.isSelectedUser,
                    selectedUserId:selectedInfo.selectedUserId,
                    isSelectChannel:selectedInfo.isSelectChannel,
                    selectedChannelId:selectedInfo.selectedChannelId,
                    
                   },fetchData,chakUser,chekChannel,FetchMessageData,FetchChannalMessageData,fetchChannelsData,ChangeUsers,
                   selectedUserInfo:selectedInfo.isSelectedUser&&selectedInfo.selectedUserId&&selectedInfo.users.length?selectedInfo.users.find(user => user.id==selectedInfo.selectedUserId):{},
                   selectedChannelInfo:selectedInfo.isSelectChannel&&channelsData.length?channelsData.find(channel => channel._id===selectedInfo.selectedChannelId):{},
                   messages:selectedInfo.messages,
                   channalMesseges:selectedInfo.channalMesseges
                   
                }
              }>
                {children}
            </TeamContext.Provider>
    )
}