import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


function CKEditorMessage({changeMessage,message,onMessageSubmit}) {
    
        return (
            <div className="ckEditor">
                
                <CKEditor
                    editor={ ClassicEditor }
                    data={message}
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
                            if(data.domEvent.key === 'Enter'){
                                let text = editor.getData()
                                onMessageSubmit(text)
                                data.preventDefault();
                                evt.stop();
                                editor.editing.view.scrollToTheSelection();
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
        );
    
}

export default CKEditorMessage;