import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile(props) {
    console.log("props in Profile:", props); //always console log props
    return (
        <div className="profile">
            <div className="content">
                👩🏻‍💻 Hello {props.first} !! What is on your mind today ?
            </div>
            <h5>
                {props.first} {props.last} 🤍
            </h5>
            <div className="row2">
                <div className="column">
                    <div className="ProfilePic">
                        <ProfilePic
                            first={props.first}
                            last={props.last}
                            profilePic={props.profilePic}
                            toggleModal={props.toggleModal}
                            setImage={props.setImage}
                        />
                    </div>
                </div>
                <div className="column">
                    <div className="bio">
                        <BioEditor bio={props.bio} setBio={props.setBio} />
                    </div>
                </div>
            </div>
        </div>
    );
}
