import React, { Component } from "react";
import io from "socket.io-client";
import CKEditorMessage from "../Views/Components/Message/ckEditor"
import Message from "../Views/Components/Message/message"
import "./socetIo.css"
const socket = io.connect("http://localhost:3000");

class SocetIo extends Component {
  constructor() {
    super();
    this.state = { msg: "", chat: [], nickname: "Ashot Amiraghyan" };
  }

  componentDidMount() {
    socket.on("chatMessage", ({ nickname, msg }) => {
      this.setState({
        chat: [...this.state.chat, { nickname, msg }]
      });
    });
  }

  onTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onMessageSubmit = () => {
    const { nickname, msg } = this.state;
    socket.emit("chatMessage", { nickname, msg });
    this.setState({ msg: "" });
  };
  changeMessage = (data)=>{
    this.setState({ msg: data });
  }
  renderChat() {
    const { chat } = this.state;
    return chat.map(({ nickname, msg }, idx) => (
      <Message key={idx} data={{nickname,msg}}/>
        
        
      
      
    ));
  }

  render() {
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