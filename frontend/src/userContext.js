import React, { useState,useEffect,useCallback, useContext, useReducer } from "react";
import axios from 'axios';
const TeamContext = React.createContext();

export const  UseTeam= ()=>{
    return useContext(TeamContext)
}
const Select_User = 'selectUser';
const Selec_Channel = 'selectChannel';
const Take_messages = 'takeMessages'

const selectUserReducer = (state,action)=> {
    switch (action.type){
        case Select_User:return{...state,isSelectedUser:true,selectedUserId:action.id,isSelectChannel:false,selectedChannelId:''};
        case Selec_Channel:return{...state,isSelectedUser:false,selectedUserId:'',isSelectChannel:true,selectedChannelId:action.id};
        case Take_messages:return{...state,messages:action.data}
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
  let [userAcountData, setUserAcountData] = useState(null);
  const [selectedInfo,dispach]= useReducer(selectUserReducer,{
    isSelectedUser:false,
    selectedUserId:"",
    isSelectChannel:false,
    selectedChannelId:'',
    messages:[],
})
// const [directMessage,dispach]= useReducer(selectUserReducer,{
 
// })
const chakUser = (id)=>dispach({
    type:Select_User,
    id
})
const chekChannel = (id)=>dispach({
    type:Selec_Channel,
    id
});
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
  const fetchData = useCallback(() => {
    axios({
      "method": "GET",
      "url": "https://localhost:3000/api/team/71",
    })
    .then((response) => {
      setResponseData(response.data)
      // console.log(response.data)
      let id = response.data[0].user_id;
      localStorage.setItem('selectedTeamId',response.data[0].team_id)
      // localStorage.setItem('selectedUserId',id)
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
  }, [])
  
    
  
useEffect( () => {
    fetchData();
    fetchUsersData();
    
    
   
    
  }, [fetchData,fetchUsersData,])
    return(
            <TeamContext.Provider 
            value = {
                {
                   team:responseData?
                   {   createdAt:responseData[0].createdAt,
                       team_id:responseData[0].team_id,
                       team_name:responseData[0].team_name,
                       updatedAt:responseData[0].updatedAt,
                       _id:responseData[0]._id,
                       user_id:responseData[0].id,
                   }:{},
                   users:responseData?usersData:[],
                   userAcountData:userAcountData?userAcountData[0]:[],
                   selectedInfo:{
                    isSelectedUser:selectedInfo.isSelectedUser,
                    selectedUserId:selectedInfo.selectedUserId,
                    isSelectChannel:selectedInfo.isSelectChannel,
                    selectedChannelId:selectedInfo.selectedChannelId
                   },chakUser,chekChannel,FetchMessageData,
                   selectedUserInfo:selectedInfo.isSelectedUser&&usersData?usersData.find(users => users._id==selectedInfo.selectedUserId):{},
                   messages:selectedInfo.messages
                   
                }
              }>
                {children}
            </TeamContext.Provider>
    )
}