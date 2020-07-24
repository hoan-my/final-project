import React from "react";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";
import axios from "./axios";
import Profile from "./profile";
import Form from "./form";
import Planner from "./planner";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        // this.componentDidMount = this.componentDidMount.bind(this);
        // this.setImage = this.setImage.bind(this);
    }

    //lifecycle methods from React (like mounted version)
    // componentDidMount() {
    //     console.log("my component has mounted");
    //     // axios request to the server to get info about the user (first, last, profile pic)
    //     axios.get("/user").then((response) => {
    //         console.log("response GET/user: ", response.data[0]);
    //         //store response from server in state
    //         //COMPLETE HERE
    //         // log "this.sate" and see user first, last, profil pic
    //         this.setState({
    //             first: response.data.first,
    //             last: response.data.last,
    //         });
    //     });
    // }

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

    render() {
        console.log("this.state:", this.state);
        return (
            <BrowserRouter>
                <div className="App">
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
                                />
                            </div>
                        )}
                    />
                    <Route path="/form" component={Form} />
                    <Route path="/planner" component={Planner} />

                    {/* <Route path="/chat" component={chat} /> */}
                    <footer>©Hoan-My 2020</footer>
                </div>
            </BrowserRouter>
        );
    }
}
