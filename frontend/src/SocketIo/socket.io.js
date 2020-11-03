import React, { Component } from "react";
import io from "socket.io-client";
import Message from '../Views/Components/Message/message'

const socket = io.connect("http://localhost:3000");

class SocetIo extends Component {
  constructor() {
    super();
    this.state = { msg: "", chat: [], nickname: "" };
  }

  componentDidMount() {
    socket.on("chatMessage", ({ nickname, msg }) => {
      this.setState({
        chat: [...this.state.chat, { nickname, msg }]
      });
      console.log({socket})
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

  renderChat() {
    const { chat } = this.state;
    return chat.map(({ nickname, msg }, idx) => (
      <Message data = {{nickname,msg}} key = {idx}/>
      
    ));
  }

  render() {
    return (
      <div>
        <span>Nickname</span>
        <input
          name="nickname"
          onChange={e => this.onTextChange(e)}
          value={this.state.nickname}
        />
        <span>Message</span>
        <input
          name="msg"
          onChange={e => this.onTextChange(e)}
          value={this.state.msg}
        />
        <button onClick={this.onMessageSubmit}>Send</button>
        <div>{this.renderChat()}</div>
      </div>
    );
  }
}



export default SocetIo;