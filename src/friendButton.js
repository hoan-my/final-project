import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    console.log("props:", props.friendId);
    const friendId = props.friendId;
    const [buttonText, setButtonText] = useState("SEND FRIEND REQUEST");

    useEffect(() => {
        console.log("friendId:", friendId);
        axios
            .get(`/get-initial-status/:${friendId}.json`)
            .then((result) => {
                console.log(result);
                if (
                    result.data.receiver_id == friendId &&
                    !result.data.accepted
                ) {
                    setButtonText("FRIEND REQUEST PENDING");
                }
            })
            .catch((err) => {
                console.log("error /get-initial-status/", err);
            });
    }, [buttonText]);

    const handleClick = (e) => {
        e.preventDefault();
        console.log("handleclick running");
        if (buttonText == "SEND FRIEND REQUEST") {
            axios
                .post(`/make-friend-request/:${friendId}.json`)
                .then((result) => {
                    console.log("Result POST /make-friend-request/: ", result);
                    setButtonText("FRIEND REQUEST PENDING");
                })
                .catch((err) => {
                    console.log("error in handleClick", err);
                });
        }
    };

    return (
        <div className="friendButton">
            <p onClick={handleClick}> {buttonText} </p>
        </div>
    );
}
