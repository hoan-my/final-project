import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";
import FindPeople from "./findPeople";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";
import OtherProfile from "./otherprofile";
import Friends from "./friends";

export default function Profile(props) {
    console.log("props in Profile:", props); //always console log props
    return (
        <BrowserRouter>
            <div className="profile">
                <div className="content">
                    Hello {props.first} !! Would you like to
                    <button>
                        <Link to="/find" className="find">
                            meet new people
                        </Link>
                        <Route path="/user/:id" component={OtherProfile} />
                    </button>{" "}
                    ? or check what{" "}
                    <button>
                        <Link to="/friends">your friends</Link>
                        <Route path="/friends" render={() => <Friends />} />
                    </button>{" "}
                    are up to ?
                </div>
                <h5>
                    {props.first} {props.last} 🤍
                </h5>
                <Route exact path="/find" component={FindPeople} />
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
        </BrowserRouter>
    );
}
