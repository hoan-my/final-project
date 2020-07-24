import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";

// export default function Profile(props) {
//     console.log("props in Profile:", props); //always console log props
//     return (
//         <div className="profile">
//             Welcome {props.first}.
//             <Link to="/form" className="form">
//                 Start your Journey...
//             </Link>
//             <ProfilePic
//                 first={props.first}
//                 last={props.last}
//                 profilePic={props.profilePic}
//                 toggleModal={props.toggleModal}
//                 setImage={props.setImage}
//             />
//         </div>
//     );
// }

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        console.log("my component has mounted");
        axios.get("/user").then((response) => {
            console.log("response GET/user: ", response.data);
            this.setState({
                first: response.data[0].first,
                last: response.data[0].last,
            });
        });
    }

    render() {
        console.log("state in Profiles:", this.state); //always console log props
        return (
            <div className="profile">
                Welcome {this.state.first}.
                <Link to="/form" className="form">
                    Start your Journey...
                </Link>
                {/* <ProfilePic
                    first={props.first}
                    last={props.last}
                    profilePic={props.profilePic}
                    toggleModal={props.toggleModal}
                    setImage={props.setImage}
                /> */}
            </div>
        );
    }
}
