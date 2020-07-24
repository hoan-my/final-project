import axios from "./axios";
// will contain all of our action creator functions
// action creator is just a function that returns an object with a property called TYPE
// object that it returns is called an action

export async function chatMessages(msgs) {
    return {
        type: "SHOW_MESSAGES",
        msgs,
    };
}

export async function chatMessage(msg) {
    return {
        type: "SEND_MESSAGE",
        msg,
    };
}
