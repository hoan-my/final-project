//if action =x, change state to this

export default function reducer(state = { showFriends: [] }, action) {
    if (action.type == "SHOW_FRIENDS") {
        state = {
            ...state,
            showFriends: action.showFriends,
        };
    }

    if (action.type == "DELETE_FRIEND") {
        let friendsList = [];
        state.showFriends.map((each) => {
            if (each.id != action.id) {
                friendsList.push(each);
            }
        });
        state = {
            ...state,
            showFriends: friendsList,
        };
    }

    if (action.type == "ACCEPT_FRIEND") {
        let friendsList = [];
        state.showFriends.map((each) => {
            if (each.id == action.id) {
                each.accepted = true;
            }
            friendsList.push(each);
        });
        state = {
            ...state,
            showFriends: friendsList,
        };
    }

    return state;
}
