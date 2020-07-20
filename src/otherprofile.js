import React from "react";
import axios from "./axios";
import FriendButton from "./friendButton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        console.log("props in mounted:", this.props);
        axios
            .get(`/user/${id}.json`)
            .then((response) => {
                console.log("RESP OTHER: ", response.data);
                if (!response.data.profilePic) {
                    response.data.profilePic = "/profilePic.png";
                }
                if (response.data.match) {
                    this.props.history.push("/");
                }
                this.setState(response.data);
            })
            .catch((err) => {
                console.log("Error in mounted: ", err);
            });
    }

    render() {
        return (
            <div className="OtherProfile">
                <h1>
                    {this.state.first} {this.state.last}
                </h1>

                <div>
                    <img className="profile-pic" src={this.state.profilePic} />
                </div>
                <div>
                    {!this.state.bio && <p>No bio available</p>}
                    <p>{this.state.bio}</p>

                    <FriendButton friendId={location.pathname.slice(6)} />
                </div>
            </div>
        );
    }
}
