import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: null,
            error: false,
        };
    }

    handleChange(e) {
        this.setState({
            imageUrl: e.target.files[0],
        });
    }

    //when the user selects an image
    // store that image in state
    // use reference from image board
    //store file in FormData()
    uploadImage(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("imageUrl", this.state.imageUrl);
        axios
            .post("/upload", formData)
            .then((result) => {
                console.log("result in /upload: ", result);
                location.replace("/");
            })
            .catch((err) => {
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div className="modal">
                <p id="close-btn" onClick={this.props.closeModal}>
                    X
                </p>
                <form>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={(e) => this.uploadImage(e)}>Update</button>
                </form>
            </div>
        );
    }
}
