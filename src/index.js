import React from "react";
import ReactDOM from "react-dom";
import TimelineContainerComponent from "./components/TimelineContainerComponent";
import { data, totalTrackLength } from "./data/sampleData";
import "./assets/css/styles.css";

// Boilerplate
ReactDOM.render(
  <TimelineContainerComponent segmentData={data} totalTrackLength={totalTrackLength} />,
  document.getElementById("root")
);
