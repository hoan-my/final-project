import React, { useEffect, useState } from "react";
import axios from "./axios";
import Moment from "react-moment";
import moment from "moment";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";
import Chat from "./chat";
import List from "./list";
import Budget from "./budget";
import Timer from "./timer";

export default class Planner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateStart: null,
            dateEnd: null,
            location: null,
            days: [],
            toDo: "",
            toEat: "",
            toSleep: "",
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.enumerateDaysBetweenDates = this.enumerateDaysBetweenDates.bind(
            this
        );
    }

    handleChange(e) {
        console.log(e.target.value);
        this.setState({
            [e.target.name]: e.target.value,
        });
        console.log("Planner state:", this.state);
    }

    planner(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("planner function running");
            axios
                .post("/plan", this.state)
                .then((response) => {
                    console.log("response /planner:", response);
                    if (response.data.error) {
                        this.setState({
                            error: true,
                        });
                    } else {
                        this.setState({
                            error: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log("error in axios POST /register:", err);
                });
        }
    }

    enumerateDaysBetweenDates(startDate, endDate) {
        var dates = [];

        startDate = startDate.add(1, "days");

        while (
            startDate.format("DD/MM/YYYY") !== endDate.format("DD/MM/YYYY")
        ) {
            dates.push(startDate.format("dddd D MMM YYYY")); // format change here
            startDate = startDate.add(1, "days");
        }

        return dates;
    }

    componentDidMount() {
        console.log("my component has mounted");
        axios.get("/plan").then((response) => {
            console.log("response GET/planner: ", response.data);
            this.setState({
                dateStart: response.data[0].datestart,
                dateEnd: response.data[0].dateend,
                location: response.data[0].location,
                days: this.enumerateDaysBetweenDates(
                    moment(response.data[0].datestart),
                    moment(response.data[0].dateend)
                ),
            });
        });
    }

    render() {
        console.log("state in Planner / dateStart:", this.state.days); //always console log props

        return (
            <BrowserRouter>
                <div className="PlannerApp">
                    <h1>YOUR PLANNER</h1>
                    <div className="Menu">
                        <Link to="/chat">
                            {" "}
                            <h4>
                                <h3 className="Links">CHATBOX</h3>
                            </h4>
                        </Link>
                        <Route path="/chat" render={() => <Chat />} />
                        <Link to="/list">
                            <h4>
                                <h3 className="Links"> BAGGAGE Checklist</h3>
                            </h4>
                        </Link>
                        <Route path="/list" render={() => <List />} />
                        <Link to="/budget">
                            {" "}
                            <h4>
                                <h3 className="Links">Budget Tracker</h3>
                            </h4>
                        </Link>
                        <Route path="/budget" render={() => <Budget />} />
                    </div>
                    <div className="Planner-title">
                        IN {this.state.location} FOR{" "}
                        <Moment
                            className="Planner-title"
                            diff={this.state.dateStart}
                            unit="days"
                        >
                            {this.state.dateEnd}
                        </Moment>{" "}
                        days
                    </div>
                    <div className="Planner-title">
                        FROM {this.state.dateStart} TO {this.state.dateEnd}
                    </div>
                    <div className="Planner-title">
                        <Moment className="Planner-title" fromNow>
                            {this.state.dateStart}
                        </Moment>
                    </div>
                    <a href="#arrow-bottom">
                        <div id="arrow-top">↓</div>
                    </a>

                    <div className="Planner">
                        {this.state.enumerateDaysBetweenDates}
                        {this.state.days.map((day) => (
                            <div className="container">
                                <div className="Day"> {day} </div>
                                <li>
                                    <input
                                        type="toDo"
                                        name="toDo"
                                        placeholder="ANY PLANS?"
                                        onChange={(e) => this.handleChange(e)}
                                    />
                                </li>
                                <li>
                                    <input
                                        type="ToEat"
                                        name="ToEat"
                                        placeholder="YUM-YUM"
                                        onChange={(e) => this.handleChange(e)}
                                    />
                                </li>
                                <li>
                                    <input
                                        type="toSleep"
                                        name="toSleep"
                                        placeholder="Zzz..."
                                        onChange={(e) => this.handleChange(e)}
                                    />
                                </li>
                                {/* <input
                                    type="submit"
                                    value="submit"
                                    onKeyDown={(e) => this.planner(e)}
                                />
                                <input
                                    type="submit"
                                    value="edit"
                                    onKeyDown={(e) => this.planner(e)} 
                                />*/}
                            </div>
                        ))}
                    </div>
                    <a href="#arrow-top">
                        <div id="arrow-bottom">↑</div>
                    </a>
                    <footer className="footer">©HOAN-MY 2020</footer>
                </div>
            </BrowserRouter>
        );
    }
}

//loop
//moment.js
// => state
//map findpeople component

// export default function Planner(props) {
//     const [search, setSearch] = useState("");
//     const [results, setResults] = useState("");
//     const [form, setForm] = useState([]);

//     useEffect(() => {
//         axios.get("/plan").then((response) => {
//             console.log("get/plan in useEffect : ", response.data);
//             setForm(response.data);
//         });
//     }, []);

//     console.log("response.data", response.data);

//     useEffect(() => {
//         let abort;
//         if (search != "") {
//             (async () => {
//                 var enumerateDaysBetweenDates = function (startDate, endDate) {
//                     var dates = [];
//                     startDate = startDate.bind(1, "days");
//                     while (
//                         startDate.format("YYYY-MM-DD") !==
//                         endDate.format("YYYY-MM-DD")
//                     ) {
//                         console.log(startDate.toDate());
//                         dates.push(startDate.toDate());
//                         startDate = startDate.bind(1, "days");
//                     }
//                     return dates;
//                 };
//                 if (!abort) {
//                     setResults(data);
//                     console.log("results in search: ", results);
//                 }
//             })();
//         } else {
//             setResults([]);
//         }
//         return () => {
//             abort = true;
//         };
//     }, [search]);
// }

// if (search) {
//     return (
//         <div className="users-container">
//             {dates.map((each) => (
//                 <p>{each.dates}</p>
//             ))}
//         </div>
//     );
// }
