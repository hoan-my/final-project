import React from "react";
import ProfilePic from "./profilepic";

export default function Profile(props) {
    console.log("props in Profile:", props); //always console log props
    return (
        <div className="container">
            <h1>This is my Profile Component</h1>
            <h2>My name is {props.first}</h2>

            <ProfilePic dill={this.props.dill} />
        </div>
    );
}
