//if action =x, change state to this

export default function reducer(state = { showFriends: [] }, action) {
    if (action.type == "SHOW_FRIENDS") {
        console.log("show friends action", action);
        state = {
            ...state,
            showFriends: action.myFriends,
        };
    }

    if (action.type === "SHOW_MESSAGES") {
        state = Object.assign({}, state, {
            chatMessages: action.msgs.reverse(),
        });
    }
    if (action.type === "SEND_MESSAGE") {
        state = Object.assign({}, state, {
            chatMessages: state.chatMessages.concat(action.msg),
        });
    }
    return state;
}
