import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            bioEditorIsVisible: false,
            error: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.uploadBio = this.uploadBio.bind(this);
        this.editBio = this.editBio.bind(this);
        this.getCurrentDisplay = this.getCurrentDisplay.bind(this);
        this.resetError = this.resetError.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleChange(e) {
        console.log("bio:", e.target.value);
        this.setState({
            bio: e.target.value,
        });
    }

    uploadBio(e) {
        e.preventDefault();
        console.log("uploadBio is running");
        axios
            .post("/bio", { bio: this.state.bio })
            .then((result) => {
                console.log("result from uploadBio ", result);
                location.replace("/plan");
            })
            .catch((err) => {
                this.setState({
                    error: true,
                });
                console.log("Error in uploadBio: ", err);
            });
        this.setState({
            bioEditorIsVisible: false,
        });
    }

    editBio() {
        console.log("editBio is running");
        this.setState({
            bioEditorIsVisible: true,
            error: false,
        });
    }

    closeModal() {
        console.log("closeModal is running");
        this.setState({
            bioEditorIsVisible: false,
            error: false,
        });
    }

    resetError(e) {
        e.preventDefault();
        this.setState({
            error: false,
        });
    }

    getCurrentDisplay() {
        console.log("display is running");
        if (this.state.bioEditorIsVisible) {
            return (
                <div>
                    <textarea
                        onChange={this.handleChange}
                        onFocus={this.resetError}
                    ></textarea>
                    <button onClick={this.uploadBio}>Save</button>
                    <button onClick={this.closeModal}>Cancel</button>
                </div>
            );
        } else if (this.props.bio) {
            return (
                <div>
                    <p>{this.props.bio}</p>
                    <button onClick={this.editBio}>Edit your Bio</button>
                </div>
            );
        } else {
            return (
                <div>
                    <p>Your bio is empty</p>
                    <button onClick={this.editBio}>
                        Tell us more about yourself
                    </button>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.getCurrentDisplay()}
                {this.state.error && (
                    <div className="error">
                        Oops... Please try again or refresh the page
                    </div>
                )}
            </div>
        );
    }
}
