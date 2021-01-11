import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "./message.css"
import {UseTeam} from "../../../userContext"
function CKEditorMessage({changeMessage,message,onMessageSubmit}) {
    const {selectedUserInfo,selectedChannelInfo} = UseTeam()
    const [placeholder,setPlaceHolder] = useState ('')
    // useEffect (()=>{
    //     console.log(placeholder)
    //     console.log(selectedUserInfo,selectedChannelInfo)
    //    if(selectedUserInfo&&selectedUserInfo.firstname){
    //     setPlaceHolder(`Message ${selectedUserInfo.firstname} ${selectedUserInfo.lastname}`)
    //     console.log(selectedUserInfo,selectedChannelInfo)
    //    }
    //    if(selectedChannelInfo&&selectedChannelInfo.channelName){
    //     setPlaceHolder(`Message #${selectedChannelInfo.channelName}`)
    //     console.log(selectedUserInfo,selectedChannelInfo)
    //    }
    // },[selectedUserInfo,selectedChannelInfo])
    // if(placeholder.length){
        return (
            <div className="ckEditor-continer">
                <div className = 'ckEditor'>
                <CKEditor
                    editor={ ClassicEditor }
                    data={message} 
                       
                    config = {{
                        toolbar: [ 'bold', 'italic', 'link','numberedList', 'bulletedList' ],
                        ignoreEmptyParagraph:true,
                        placeholder: 'Message'
                        }
                    }                 
                    // onReady={ editor => {
                       
                    //     console.log( 'Editor is ready to use!', editor );
                    // } }
                    onChange={ ( event, editor ) => {
                        
                        const data = editor.getData();
                        
                        changeMessage(data)
                    } }
                    
                    // onBlur={ ( event, editor ) => {
                    //     console.log( 'Blur.', editor,event );
                    // } }
                    onFocus={ ( event, editor ) => {
                       
                        
                        editor.editing.view.document.on( 'keydown', ( evt, data ) => {
                            if(data.domEvent.keyCode === 13){
                                
                                if (!data.domEvent.shiftKey){
                                     // editor.data.trim()
                                let text = editor.getData()
                                console.log()
                                if(text){
                                    onMessageSubmit(text)
                                    data.preventDefault();
                                    editor.editing.view.scrollToTheSelection();
                                    evt.stop();
                                }
                                else{
                                }
                                }
                               
                                
                            }
                        })
                        // editor.editing.view.document.on( 'enter', ( evt, data ) => {
                        //     if ( data.isSoft ) {
                        //         console.log(1)
                        //         editor.execute( 'enter' );
                        //     } else {
                        //         console.log(newData,'sadasd')
                        //         onMessageSubmit()
                        //                 }
                        //     console.log(newData,'sadasd')
                        //     data.preventDefault();
                        //     evt.stop();
                        //     editor.editing.view.scrollToTheSelection();
                        // }, { priority: 'high' } ); 
                            
                     }
                }
                />

                </div>
                
                
            </div>
        );
    // }
    //    else return(null)
    
}

export default CKEditorMessage;