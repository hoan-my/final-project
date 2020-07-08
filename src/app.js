import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
    }

    //lifecycle methods from React (like mounted version)
    componentDidMount() {
        console.log("my component has mounted");
        // axios request to the server to get info about the user (first, last, profile pic)
        axios.get("/user").then((response) => {
            //store response from server in state
            //COMPLETE HERE
            // log "this.sate" and see user first, last, profil pic
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

    //rendering profile picture and passing props (first)
    render() {
        console.log("this.state:", this.state);
        return (
            <div>
                <h1>App</h1>
                <Profile />
                {/* <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    profilePic={this.state.profilePic}
                    toggleModal={this.toggleModal}
                /> */}
                <p onClick={() => this.toggleModal()}>
                    {" "}
                    click me to toggle the modal{" "}
                </p>
                {this.state.uploaderIsVisible && (
                    <Uploader setImage={this.setImage} />
                )}
            </div>
        );
    }
}
