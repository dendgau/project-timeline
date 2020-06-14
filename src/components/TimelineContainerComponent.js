import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import LevelComponent from "./LevelComponent";

// Convert data timeline to seperate level in array
const getTimelineSegmentByLevel = segmentData  => {
	if (!_.isArray(segmentData)) {
		return [];
	}

	let timelineSegmentLevel = [];
	let level = 0;

	// Sort timeline data with start and end value
	segmentData.sort(function(n, m) {
		return (n.start - m.start) || (n.end - m.end) || (n.id - m.id);
	});

	// Move item from curent data to list result until curent data become empty
	while (!_.isEmpty(segmentData)) {
		let lastItemInLevel = segmentData.shift();
		if (!_.isNil(lastItemInLevel)) {
			// Add first item in separate level
			timelineSegmentLevel[level] = [];
			timelineSegmentLevel[level].push(lastItemInLevel);

			// Check next item and add to list item of current level
			segmentData.forEach(function(checkingItem, index, segmentData) {
				if (lastItemInLevel.end < checkingItem.start) {
					timelineSegmentLevel[level].push(checkingItem);
					segmentData.splice(index, 1);
					lastItemInLevel = checkingItem;
				}
			});

			// Go to next level
			level++;
		}
	}

	return timelineSegmentLevel;
}

// Assume all data is valid and sorted by start time
const TimelineContainerComponent = ({segmentData, totalTrackLength}) => {
	const timelineSegmentLevel = getTimelineSegmentByLevel(segmentData);
	if (_.isEmpty(timelineSegmentLevel)) {
		return "";
	}

	return (
		<div className="container">
			{
				timelineSegmentLevel.map((segments, index) => 
					<LevelComponent segments={segments} totalTrackLength={totalTrackLength}/>
				)
			}
		</div>
	)
};

export default TimelineContainerComponent;