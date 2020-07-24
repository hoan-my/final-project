import React, { useEffect, useState } from "react";
import axios from "./axios";
import Moment from "react-moment";

export default class Planner extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        console.log("my component has mounted");
        axios.get("/plan").then((response) => {
            console.log("response GET/planner: ", response.data);
            this.setState({
                dateStart: response.data[0].datestart,
                dateEnd: response.data[0].dateend,
                location: response.data[0].location,
            });
        });
    }

    //loop
    //moment.js
    // => state
    //map findpeople component

    componentDidMount() {
        var enumerateDaysBetweenDates = function (dateStart, dateEnd) {
            var dates = [];

            dateStart = dateStart.add(1, "days");

            while (
                dateStart.format("M/D/YYYY") !== dateEnd.format("M/D/YYYY")
            ) {
                console.log(dateStart.toDate());
                dates.push(dateStart.toDate());
                dateStart = dateStart.add(1, "days");
            }

            return dates;
        };
    }

    render() {
        console.log("state in Planner:", this.state); //always console log props
        return (
            <div>
                Here is your planner from {this.state.dateStart} to
                {this.state.dateEnd}.

                {dates.map((dates) => <li>{dates}</li>}
            </div>
        );
    }
}
