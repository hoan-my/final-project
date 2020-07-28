import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import moment from "moment";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.chatMessages);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        console.log("CHAT MESSAGES: ", chatMessages);
    }, [chatMessages]);

    const keyCheck = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            socket.emit("My amazing chat message", event.target.value);
            event.target.value = "";
        }
    };

    return (
        <div className="app2">
            <div className="button-app">
                <Link to="/planner">
                    {" "}
                    <h4>
                        <h3 className="Links"> X </h3>
                    </h4>
                </Link>
            </div>

            <div className="chat-container">
                <h6>CHATBOX</h6>
                <textarea
                    placeholder="Let's chat!"
                    onKeyDown={keyCheck}
                ></textarea>
            </div>
            <div className="chat-container1" ref={elemRef}>
                {chatMessages &&
                    chatMessages.reverse().map((each) => (
                        <div className="chat-container2">
                            <div className="chatSender">
                                {each.first} 💬 {""}
                            </div>
                            <div className="chatMsg" key={each.message_id}>
                                {each.message}
                            </div>

                            <div className="chatDate">
                                <Moment format="DD/MM/YY h:mm">
                                    {each.created_at}
                                </Moment>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
