import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            error: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.uploadImg = this.uploadImg.bind(this);
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
                this.props.setImage(result.data.imgUrl);
                this.props.closeModal();
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
                <form onSubmit={this.uploadImage}>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={this.handleChange}
                    />
                    <button>Update</button>
                </form>
            </div>
        );
    }
}
