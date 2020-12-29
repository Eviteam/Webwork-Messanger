import React from "react";
import './users.css';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
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
               <p>DirectMesseges</p>
           </span>
           <span className = 'AddCircleIcon_user'>
           <AddCircleIcon/>
           </span>
       </div>
       <div className = 'users_continer'>

            {isOpenUsers && users.map((item,index)=>{
               
                    return (
                        <User key = {index} title = {`${item.firstname} ${item.lastname}`} Icon = {AccountBoxIcon}  id = {item._id} selectUser = {selectUser} selected ={selected} newMassage= {item.newMassage}/>
                    )
                   
                })}
                  {/* {isOpenUsers?<div className = 'add_user'>
                     <AddIcon/>
                     <h3>Add Teammates</h3>
                 </div>:null} */}
       </div>
       
       
      </div>
    );
  }
  
  export default Users;
  