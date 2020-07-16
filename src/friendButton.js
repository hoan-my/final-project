import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    console.log("props:", props.friendId);
    const friendId = props.friendId;
    const [buttonText, setButtonText] = useState("SEND FRIEND REQUEST");
    const [friendStatus, setFriendStatus] = useState(null);

    const handleClick = (e) => {
        e.preventDefault();
        console.log("handleclick running");
        if (friendStatus == null) {
            axios
                .post(`/make-friend-request/:${friendId}.json`)
                .then((result) => {
                    console.log("Result POST /make-friend-request/: ", result);
                    buttonText == "FRIEND REQUEST PENDING";
                    setButtonText("FRIEND REQUEST PENDING");
                    setFriendStatus("pending");
                })
                .catch((err) => {
                    console.log("error in handleClick", err);
                });
        } else if (buttonText == "FRIEND REQUEST PENDING") {
            axios
                .post(`/accept-friend-request/:${friendId}.json`)
                .then((result) => {
                    setButtonText("ACCEPT FRIEND REQUEST");
                    setFriendStatus("accepted");
                })
                .catch((err) => {
                    console.log("error in handleClick", err);
                });
        } else if (
            buttonText == "SEND FRIEND REQUEST" ||
            buttonText == "ACCEPT FRIEND REQUEST"
        ) {
            axios
                .post(`/end-friendship/:${friendId}.json`)
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
            .get(`/get-initial-status/:${friendId}.json`)
            .then((result) => {
                console.log(result);
                if (
                    result.data.receiver_id == friendId &&
                    !result.data.accepted
                ) {
                    setButtonText("PENDING FRIEND REQUEST");
                    setFriendStatus("pending");
                } else if (result.data.accepted) {
                    setButtonText("ACCEPT FRIEND REQUEST");
                    setFriendStatus("accepted");
                } else if (result.data.friendStatus == null) {
                    setButtonText("SEND FRIEND REQUEST");
                }
            })
            .catch((err) => {
                console.log("error /get-initial-status/", err);
            });
    }, [buttonText, friendStatus]);

    return (
        <div className="friendButton">
            <p onClick={(e) => handleClick(e)}> {buttonText} </p>
        </div>
    );
}
