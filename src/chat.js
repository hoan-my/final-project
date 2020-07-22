import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

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
        <div className="OtherProfile">
            <h1>Let's chat!</h1>
            <div className="chat-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((each) => (
                        <div>
                            <div className="chatSender">
                                {" "}
                                <img
                                    className="chatPic"
                                    src={each.imageUrl || "profilePic.png"}
                                />
                                {each.first} says :
                            </div>
                            <div className="center">
                                <p className="chatMsg" key={each.message_id}>
                                    {each.message}
                                </p>
                                <p className="chatDate">on {each.created_at}</p>
                            </div>
                        </div>
                    ))}

                <textarea
                    placeholder="Add your message here"
                    onKeyDown={keyCheck}
                ></textarea>
            </div>
        </div>
    );
}
