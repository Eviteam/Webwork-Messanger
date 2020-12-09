import React, { useState,useEffect,useCallback, useContext, useReducer } from "react";
import axios from 'axios';
const TeamContext = React.createContext();

export const  UseTeam= ()=>{
    return useContext(TeamContext)
}
const Select_User = 'selectUser';
const Selec_Channel = 'selectChannel'
const reducer = (state,action)=> {
    switch (action.type){
        case Select_User:return{...state,isSelectedUser:true,selectedUserId:action.id,isSelectChannel:false,selectedChannelId:''};
        case Selec_Channel:return{...state,isSelectedUser:false,selectedUserId:'',isSelectChannel:true,selectedChannelId:action.id}
        default:return state
    }
}

export const UserProvider = ({children})=>{
  let [responseData, setResponseData] = useState(null);
  let [userAcountData, setUserAcountData] = useState(null);
  const [state,dispach]= useReducer(reducer,{
    isSelectedUser:false,
    selectedUserId:"",
    isSelectChannel:false,
    selectedChannelId:''
})
const chakUser = (id)=>dispach({
    type:Select_User,
    id
})
const chekChannel = (id)=>dispach({
    type:Selec_Channel,
    id
})
  const fetchData = useCallback(() => {
    axios({
      "method": "GET",
      "url": "https://localhost:3000/api/team/71",
    })
    .then((response) => {
      setResponseData(response.data)
      console.log(response.data)
      let id = response.data[0].user_id;
      // localStorage.setItem('selectedUserId',id)
      axios({
        "method": "GET",
        "url": `https://localhost:3000/api/users/${id}`,
      })
      .then((response) => {
        setUserAcountData(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
        
      })
    })
    .catch((error) => {
      console.log(error)
      
    })
  }, [])
  
    
  
useEffect(() => {
    fetchData();
  }, [fetchData])
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
                       user_id:responseData[0].user_id,
                   }:{},
                   users:responseData?responseData[0].users:[],
                   userAcountData:userAcountData?userAcountData[0]:[],
                   chakedInfo:{
                    isSelectedUser:state.isSelectedUser,
                    selectedUserId:state.selectedUserId,
                    isSelectChannel:state.isSelectChannel,
                    selectedChannelId:state.selectedChannelId
                   },chakUser,chekChannel,
                   selectedUserInfo:state.isSelectedUser&&responseData?responseData[0].users.find(users => users.id==state.selectedUserId):{}
                   
                }
              }>
                {children}
            </TeamContext.Provider>
    )
}