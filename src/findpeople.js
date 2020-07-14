import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople(props) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("/users").then((response) => {
            console.log("get/users in useEffect : ", response.data);
            setUsers(response.data);
        });
    }, []);

    useEffect(() => {
        let abort;
        if (search != "") {
            (async () => {
                const { data } = await axios.get(`/results/${search}.json`);
                if (!abort) {
                    setResults(data);
                    console.log("results in search: ", results);
                }
            })();
        } else {
            setResults([]);
        }
        return () => {
            abort = true;
        };
    }, [search]);

    if (search == "") {
        return (
            <div>
                <div className="find-people">
                    <h1>Find People</h1>
                    <h3>New joiners</h3>
                </div>
                <div className="users-container">
                    {users.map((each, index) => (
                        <Link key={index} to={`/user/${each.id}`}>
                            <div className="user">
                                <p className="name">
                                    {each.first} {each.last}
                                </p>
                                <img src={each.imageUrl || "/profilePic.png"} />
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="search">
                    <h3>Looking for someone?</h3>
                    <input
                        type="text"
                        placeholder="Search for Users"
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <div className="find-people">
                    <h1>Find People</h1>
                    {(results.length > 0 && <h3>Results for "{search}"</h3>) ||
                        (!results.length && (
                            <h3 className="no-results">
                                No results for "{search}"
                            </h3>
                        ))}
                </div>
                {(results.length != 0 && (
                    <div className="results-container">
                        {results.map((each, index) => (
                            <Link key={index} to={`/user/${each.id}`}>
                                <p className="name">
                                    {each.first} {each.last}
                                </p>
                                <img src={each.imageUrl || "/profilePic.png"} />
                            </Link>
                        ))}
                    </div>
                )) ||
                    (!results.length && (
                        <div className="results-container">No results.</div>
                    ))}

                <div className="search">
                    <h3>Looking for someone?</h3>
                    <input
                        type="text"
                        placeholder="Search for Users"
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
            </div>
        );
    }
}
