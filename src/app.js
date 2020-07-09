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
        this.closeModal = this.closeModal.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.setImage = this.setImage.bind(this);
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
                profilePic: response.data.imageUrl,
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

    closeModal() {
        console.log("closeModal is running");
        this.setState({
            uploaderIsVisible: true,
        });
    }
    //rendering profile picture and passing props (first)
    render() {
        console.log("this.state:", this.state);
        return (
            <div className="App">
                <h1>App</h1>
                <h1>WOMEN OF COLORS IN TECH</h1>
                <img src="WOC.png" />
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    profilePic={this.state.profilePic}
                    toggleModal={() => this.toggleModal()}
                    setImage={() => this.setImage()}
                />
                {/* <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    profilePic={this.state.profilePic}
                    toggleModal={this.toggleModal}
                    setImage={this.setImage}
                /> */}
                {/* <p onClick={() => this.toggleModal()}>
                    {" "}
                    click me to toggle the modal{" "}
                </p> */}
                {this.state.uploaderIsVisible && (
                    <Uploader
                        setImage={() => this.setImage()}
                        closeModal={() => this.closeModal()}
                    />
                )}
            </div>
        );
    }
}
