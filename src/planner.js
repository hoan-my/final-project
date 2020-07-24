import React, { useEffect, useState } from "react";
import axios from "./axios";
import Moment from "react-moment";
import moment from "moment";
export default class Planner extends React.Component {
    constructor() {
        super();
        this.state = {
            dateStart: null,
            dateEnd: null,
            location: null,
            days: [],
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.enumerateDaysBetweenDates = this.enumerateDaysBetweenDates.bind(
            this
        );
    }

    enumerateDaysBetweenDates(startDate, endDate) {
        var dates = [];

        startDate = startDate.add(1, "days");

        while (
            startDate.format("YYYY-MM-DD") !== endDate.format("YYYY-MM-DD")
        ) {
            dates.push(startDate.format("YYYY-MM-DD")); // format change here
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
            <div>
                {this.state.days.map((day) => (
                    <span>{day}</span>
                ))}
                Here is your planner from {this.state.dateStart} to
                {this.state.dateEnd}. Using Moment :
                <Moment to={this.state.dateEnd}>{this.state.dateStart}</Moment>
                {this.state.enumerateDaysBetweenDates}
            </div>
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
