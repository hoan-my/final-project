import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { userSelector } from "react-redux";

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log("here are my last 10 chat messages:", chatMessages);
    return (
        <div>
            <p className="chat-title"> Welcome to Chat </p>
        </div>
    );
}
