import React from "react";
import './users.css';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import User from './user'
import AddIcon from '@material-ui/icons/Add';
function Users({isOpenUsers,users,changeUsersStatus,selectUser,selected}) {
   
    return (
      <div className = "users">
       <div className = "users_div">
           <span onClick = {changeUsersStatus}>
               {isOpenUsers?<ArrowDropDownIcon/>:<ArrowRightIcon/>}
           
           </span>
           <span>
               <h3>DirectMesseges</h3>
           </span>
           <span className = 'AddCircleIcon'>
           <AddCircleIcon/>
           </span>
       </div>
       <div className = 'users_continer'>

            {isOpenUsers && users.map((item,index)=>{
                console.log(item)
                    return (
                        <User key = {index} title = {`${item.firstname} ${item.lastname}`} Icon = {item.icon}  id = {item.id} selectUser = {selectUser} selected ={selected}/>
                    )
                   
                })}
                  {isOpenUsers?<div className = 'add_user'>
                     <AddIcon/>
                     <h3>Add Teammates</h3>
                 </div>:null}
       </div>
       
       
      </div>
    );
  }
  
  export default Users;