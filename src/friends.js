import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { showFriends, deleteFriend, acceptFriend } from "./actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    const myFriends = useSelector((state) => state.showFriends);
    console.log("myFriends:", myFriends);

    const friendsList = useSelector(
        (state) =>
            state.showFriends &&
            state.showFriends.filter((each) => each.accepted == true)
    );
    const friendsPending = useSelector(
        (state) =>
            state.showFriends &&
            state.showFriends.filter((each) => each.accepted == false)
    );

    useEffect(() => {
        dispatch(showFriends());
    }, []);

    console.log("myFriends:", myFriends);
    console.log("friendsList:", friendsList);
    console.log("friendspending:", friendsPending);
    return (
        <div className="OtherProfile">
            <h1>My friends</h1>

            <div id="friendsList">
                {friendsList &&
                    friendsList.map((each) => (
                        <div className="friendsProfiles" key={each.id}>
                            <Link to={`/user/:${each.id}`}>
                                <img
                                    className="friendsProfile"
                                    src={each.imageUrl || "profilePic.png"}
                                />
                                <p className="friendProfiles">
                                    {each.first} {each.last}
                                </p>
                            </Link>
                            <button
                                onClick={() => dispatch(deleteFriend(each.id))}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
            </div>

            <h1>Pending Friends Requests</h1>

            <div id="friendsPending">
                {friendsPending &&
                    friendsPending.map((each) => (
                        <div className="friendsProfiles" key={each.id}>
                            <Link to={`/user/:${each.id}`}>
                                <img
                                    className="friendsProfile"
                                    src={each.imageUrl || "profilePic.png"}
                                />
                                <p className="friendProfiles">
                                    {each.first} {each.last}
                                </p>
                            </Link>
                            <button
                                onClick={() => dispatch(acceptFriend(each.id))}
                            >
                                Accept Friend
                            </button>
                            <button
                                className="deny"
                                onClick={() => dispatch(deleteFriend(each.id))}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
