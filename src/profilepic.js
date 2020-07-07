import React from "react";

export default function ProfilePic(props) {
    console.log("props in ProfilPic:", props);
    //users who register and see App for the first time will NOT have a profile pic !
    // so if profilPic is underfined in your "props" log, it likely means the user does not have a profile pic
    // if a user does not have a profilePic yet, we need to render a profilePic for them => How can we render a default profilePic for them
    return (
        <div>
            <p>first name, last name</p>
            <img />
        </div>
    );
}
