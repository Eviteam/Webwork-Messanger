import React, { useState,useEffect,useCallback, useContext, useReducer } from "react";
import axios from 'axios';
const TeamContext = React.createContext();

export const  UseTeam= ()=>{
    return useContext(TeamContext)
}
const Chek_User = 'chekUser';
const Chek_Channel = 'chekChannel'
const reducer = (state,action)=> {
    console.log(action)
    switch (action.type){
        case Chek_User:return{...state,isChakedUser:true,chekedUserId:action.id,ischekChannel:false,chekedChannelId:''};
        case Chek_Channel:return{...state,isChakedUser:false,chekedUserId:'',ischekChannel:true,chekedChannelId:action.id}
        default:return state
    }
}

export const UserProvider = ({children})=>{
  let [responseData, setResponseData] = useState(null);
  const [state,dispach]= useReducer(reducer,{
    isChakedUser:false,
    chekedUserId:"",
    ischekChannel:false,
    chekedChannelId:''
})
const chakUser = (id)=>dispach({
    type:Chek_User,
    id
})
const chekChannel = (id)=>dispach({
    type:Chek_Channel,
    id
})
  const fetchData = useCallback(() => {
    axios({
      "method": "GET",
      "url": "https://localhost:3000/api/team/71",
    })
    .then((response) => {
      setResponseData(response.data)
      
    })
    .catch((error) => {
      console.log(error)
      
    })
  }, [])
useEffect(() => {
    fetchData()
    console.log(responseData,'usercontext')
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
                       _id:responseData[0]._id
                   }:{},
                   users:responseData?responseData[0].users:[],
                   chakedInfo:{
                    isChakedUser:state.isChakedUser,
                    chekedUserId:state.chekedUserId,
                    ischekChannel:state.ischekChannel,
                    chekedChannelId:state.chekedChannelId
                   },chakUser,chekChannel

                }
              }>
                {children}
            </TeamContext.Provider>
    )
}