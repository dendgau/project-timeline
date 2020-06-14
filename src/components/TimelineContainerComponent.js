import React from "react";
import _ from "lodash";
import LevelComponent from "./LevelComponent";

// Process parse timeline segment level data
const parseSegmentLevelProcess = ({segmentData, totalTrackLength}) => {
	// Check valid segment
	const validateSegment = (item) =>
		(item.id > 0) && 
		(item.start >= 0 && item.start <= totalTrackLength) &&
		(item.end >= 0 && item.end <= totalTrackLength) &&
		(item.start <= item.end)
		
	// Convert data timeline to seperate level in array
	const getTimelineSegmentLevel = segmentData  => {
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
			if (_.isNil(lastItemInLevel) || !validateSegment(lastItemInLevel)) {
				continue;
			}

			// Add first item in separate level
			timelineSegmentLevel[level] = [];
			timelineSegmentLevel[level].push(lastItemInLevel);

			// Check next item and add to list item of current level
			segmentData.forEach(function(checkingItem, index, segmentData) {
				if (lastItemInLevel.end < checkingItem.start) {
					segmentData.splice(index, 1); 
					if (!validateSegment(checkingItem)) {
						return;
					}
					timelineSegmentLevel[level].push(checkingItem);
					lastItemInLevel = checkingItem;
				}
			});

			// Go to next level
			level++;
		}

		return timelineSegmentLevel;
	}

	return {
		getTimelineSegmentLevel: getTimelineSegmentLevel
	}
}

// Assume all data is valid and sorted by start time
const TimelineContainerComponent = ({segmentData, totalTrackLength}) => {
	const parseProcess = parseSegmentLevelProcess({
		segmentData: segmentData,
		totalTrackLength: totalTrackLength
	});
	const timelineSegmentLevel = parseProcess.getTimelineSegmentLevel(segmentData);
	if (_.isEmpty(timelineSegmentLevel)) {
		return "";
	}

	return (
		<div className="container">
			{
				timelineSegmentLevel.map((segments, index) => 
					<LevelComponent key={index} segments={segments} totalTrackLength={totalTrackLength}/>
				)
			}
		</div>
	)
};

export default TimelineContainerComponent;