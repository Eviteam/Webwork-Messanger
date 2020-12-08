import React,{ useState,useContext } from "react";
import axios from 'axios';
import './sideBar.css';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CreateIcon from '@material-ui/icons/Create';
import Channels from '../Components/Channel/Chanels';
import Users from '../Components/Direct Messeges/users'
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import GroupIcon from '@material-ui/icons/Group';
import {useHistory} from "react-router-dom";
import {UseTeam} from "../../userContext"

function SideBar() {
    const history = useHistory();
    const {team,users,chakUser,chekChannel,chakedInfo} = UseTeam()
  // let [responseData, setResponseData] = React.useState('');
  // const fetchData = React.useCallback(() => {
  //   axios({
  //     "method": "GET",
  //     "url": "https://localhost:3000/api/team/71",
  //   })
  //   .then((response) => {
  //     setResponseData(response.data)
      
  //   })
  //   .catch((error) => {
  //     console.log(error)
      
  //   })
  // }, [])
  // React.useEffect(() => {
  //   fetchData()
   
  // }, [fetchData])

    const [channels, setChats] = useState([
      {
        channel:'firstChat',
        icon:GroupIcon,
        id:"channel-1"
      },
      {
        channel:'secondChat',
        icon:GroupIcon,
        id:"channel-2"
      },
      {
        channel:'thirdChat',
        icon:GroupIcon,
        id:"channel-3"
      },
      {
        channel:'fourthChat',
        icon:GroupIcon,
        id:"channel-4"
      },
      
        
    ]);
    
    const [isOpenChanels, setIsOpenChanels] = useState(false);
    const [isOpenUsers, setIsOpenUsers] = useState(false);
    const [selected,setSelected]= useState(0)

    const changeChanalsStatus = ()=>{
      setIsOpenChanels(!isOpenChanels)
    }
    const changeUsersStatus = ()=>{
      setIsOpenUsers(!isOpenUsers)
    }
    const selectHandler = (id,type)=>{
      if(id){
        
        history.push(`/room/${id}`);
        setSelected(id)
        if(type==='channel'){
          chekChannel(id)
        };
        if(type==='user'){
          chakUser(id)
        }
      }
      else {
        history.push('channel')
      }
    }
    return (
      <div className = "sidebar">
          <div className = "sidebar_header">
              <div className = "sidebar_info">
              <h2>{team&&team.team_name}</h2>
                <h3>
                    <FiberManualRecordIcon/>
                    Gagulik
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