import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [friendId, setFriendId] = useState(props.friendId);
    const [buttonText, setButtonText] = useState("Arkadas butonu");
    const [friendStatus, setFriendStatus] = useState(null);

    const handleClick = (e) => {
        e.preventDefault();
        console.log("handleclick running");
        if (friendStatus == null) {
            axios
                .post(`/make-friend-request/:${friendId}`)
                .then((result) => {
                    console.log("Result POST /make-friend-request/: ", result);
                    setFriendStatus("SEND FRIEND REQUEST");
                })
                .catch((err) => {
                    console.log("error in handleClick", err);
                });
        } else if (buttonText == "FRIEND REQUEST PENDING") {
            axios
                .post(`/accept-friend-request/:${friendId}`)
                .then((result) => {
                    setFriendStatus("accepted");
                    setButtonText("ACCEPT FRIEND REQUEST");
                })
                .catch((err) => {
                    console.log("error in handleClick", err);
                });
        } else if (
            buttonText == "SEND FRIEND REQUEST" ||
            buttonText == "ACCEPT FRIEND REQUEST"
        ) {
            axios
                .post(`/end-friendship/:${friendId}`)
                .then((result) => {
                    console.log("result in /end-friendship/ :", result);
                    setFriendStatus(null);
                    setButtonText("CANCEL FRIEND REQUEST");
                })
                .catch((err) => {
                    console.log("error in handleClick", err);
                });
        }
    };

    useEffect(() => {
        console.log("friendId:", friendId);
        console.log("friendStatus:", friendStatus);
        axios
            .get(`/get-initial-status/:${friendId}`)
            .then((result) => {
                console.log(result);
                if (
                    result.data.sender_id == friendId &&
                    !result.data.accepted
                ) {
                    setButtonText("PENDING FRIEND REQUEST");
                    setFriendStatus("pending");
                } else if (
                    result.data.receiver_id == friendId &&
                    !result.data.accepted
                ) {
                    setButtonText("SEND FRIEND REQUEST");
                    setFriendStatus("pending");
                } else if (result.data.accepted) {
                    setButtonText("ACCEPT FRIEND REQUEST");
                    setFriendStatus("accepted");
                } else if (result.data.friendStatus == null) {
                    setButtonText("CANCEL FRIEND REQUEST");
                }
            })
            .catch((err) => {
                console.log("error /get-initial-status/", err);
            });
    }, [buttonText, friendStatus]);

    return (
        <div className="friendButton">
            <button onClick={(e) => handleClick(e)}>{buttonText}</button>
        </div>
    );
}
