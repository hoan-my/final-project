import axios from "./axios";
// will contain all of our action creator functions
// action creator is just a function that returns an object with a property called TYPE
// object that it returns is called an action

export async function showFriends() {
    const { data } = await axios.get("/friends-wannabes");
    console.log(data);
    return {
        type: "SHOW_FRIENDS",
        myFriends: data,
    };
}

export async function deleteFriend(id) {
    await axios.post(`/unfriend/:${id}`);
    // console.log(data);
    return {
        type: "DELETE_FRIEND",
        id,
    };
}

export async function acceptFriend(id) {
    await axios.post(`/accept-friend/:${id}`);
    return {
        type: "ACCEPT_FRIEND",
        id,
    };
}

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
