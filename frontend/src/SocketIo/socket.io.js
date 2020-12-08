import React, { Component } from "react";
import io from "socket.io-client";
import CKEditorMessage from "../Views/Components/Message/ckEditor"
import Message from "../Views/Components/Message/message"
import "./socetIo.css"
const socket = io.connect("https://localhost:3000");

class SocetIo extends Component {
  constructor() {
    super();
    this.state = { msg: "", chat: [], sender: "Ashot Amiraghyan" };
  }

  componentDidMount() {
    socket.on("chatMessage", ({ sender, msg }) => {
      this.setState({
        chat: [...this.state.chat, { sender, msg }]
      });
    });
  }

  onTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onMessageSubmit = () => {
    const { sender, msg } = this.state;
    socket.emit("chatMessage", { sender, msg });
    this.setState({ msg: "" });
  };
  changeMessage = (data)=>{
    this.setState({ msg: data });
  }
  renderChat() {
    const { chat } = this.state;
    return chat.map(({ sender, msg }, idx) => (
      <Message key={idx} data={{sender,msg}}/>
        
        
      
      
    ));
  }

  render() {
    console.log(8)
    return (
      <div className = "soket_io">
        {/* <span>Nickname</span>
        <input
          name="nickname"
          onChange={e => this.onTextChange(e)}
          value={this.state.nickname}
        />
        <button onClick={this.onMessageSubmit}>Send</button> */}
        <CKEditorMessage message = {this.state.msg} changeMessage={this.changeMessage} onMessageSubmit ={this.onMessageSubmit}/>
        <div className = 'message_continer'>{this.renderChat()}</div>

      </div>

      
    );
  }
}



export default SocetIo;