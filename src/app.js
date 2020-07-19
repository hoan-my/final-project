import React from "react";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import FindPeople from "./findPeople";
import Friends from "./friends";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    //lifecycle methods from React (like mounted version)
    componentDidMount() {
        console.log("my component has mounted");
        // axios request to the server to get info about the user (first, last, profile pic)
        axios.get("/user").then((response) => {
            console.log("response GET/user: ", response);
            //store response from server in state
            //COMPLETE HERE
            // log "this.sate" and see user first, last, profil pic
            this.setState({
                first: response.data.first,
                last: response.data.last,
                profilePic: response.data.imageurl,
                bio: response.data.bio,
            });
        });
    }

    toggleModal() {
        console.log("toggleModal is running");
        this.setState({
            uploaderIsVisible: true,
        });
    }

    setImage(newProfilePic) {
        this.setState({
            profilePic: newProfilePic,
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    } //

    closeModal() {
        console.log("closeModal is running");
        this.setState({
            uploaderIsVisible: false,
        });
    }
    //rendering profile picture and passing props (first)
    render() {
        console.log("this.state:", this.state);
        return (
            <BrowserRouter>
                <div className="App">
                    <h4>
                        <img src="WOC.png" width="30px" height="30px" /> WOMEN
                        OF COLORS IN TECH
                    </h4>
                    <div className="headerPic">
                        <Link to="/friends">Friends</Link>
                        <ProfilePic
                            profilePic={this.state.profilePic}
                            toggleModal={() => this.toggleModal()}
                            setImage={() => this.setImage()}
                        />
                    </div>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <div>
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    profilePic={this.state.profilePic}
                                    toggleModal={() => this.toggleModal()}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                />
                            </div>
                        )}
                    />
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            setImage={() => this.setImage()}
                            closeModal={() => this.closeModal()}
                        />
                    )}

                    <Route path="/chat" component={chat} />
                    <footer>©Hoan-My 2020</footer>
                </div>
            </BrowserRouter>
        );
    }
}
