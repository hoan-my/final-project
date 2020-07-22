import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            error: false,
            uploaderIsVisible: false,
        };
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0],
        });
    }

    //when the user selects an image
    // store that image in state
    // use reference from image board
    //store file in FormData()
    uploadImage(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
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

    closeModal(e) {
        e.preventDefault();
        this.setState({
            UploaderIsVisible: false,
        });
    }

    render() {
        return (
            <div className="modal">
                <p className="close" onClick={(e) => this.closeModal(e)}>
                    X
                </p>
                <h2>UPDATE PROFILE PICTURE</h2>

                <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={(e) => this.uploadImage(e)}>SUBMIT</button>
            </div>
        );
    }
}
