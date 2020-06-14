import React, {useState} from "react";
import _ from "lodash";
import LevelComponent from "./LevelComponent";

// Process parse timeline segment level data
const parseSegmentLevelProcess = ({segmentList, trackLength}) => {
	const [segmentData, setSegmentDataState] = useState(segmentList);
	const [totalTrackLength, setTotalTrackLengthState] = useState(trackLength);

	// Check next segment is valid in same level
	const validateNextSegmentInSameLevel = (current, next) =>
		(current.end < next.start)

	// Check is valid single segment item
	const checkIsInvalidSegmentItem = (item) =>
		!(
			_.isObject(item) &&
			item.id > 0 && 
			item.start >= 0 &&
			item.end >= 0 &&
			item.start <= totalTrackLength &&
			item.end <= totalTrackLength &&
			item.start <= item.end
		)

	// Check is valid list of segment item
	const validateSegmentDataList = () =>
		_.isArray(segmentData) && !_.find(segmentData, checkIsInvalidSegmentItem);
		
	// Convert data timeline to seperate level in array
	const getTimelineSegmentLevel = () => {
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
			if (checkIsInvalidSegmentItem(lastItemInLevel)) {
				continue;
			}

			// Add first item in separate level
			timelineSegmentLevel[level] = [];
			timelineSegmentLevel[level].push(lastItemInLevel);

			// Check next item and add to list item of current level
			segmentData.forEach(function(checkingItem, index, segmentData) {
				if (validateNextSegmentInSameLevel(lastItemInLevel, checkingItem)) {
					segmentData.splice(index, 1); 
					if (checkIsInvalidSegmentItem(checkingItem)) {
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
		getTimelineSegmentLevel: getTimelineSegmentLevel,
		validateSegmentDataList: validateSegmentDataList
	}
}

// Assume all data is valid and sorted by start time
const TimelineContainerComponent = ({segmentData, totalTrackLength}) => {
	const parseProcess = parseSegmentLevelProcess({
		segmentList: segmentData,
		trackLength: totalTrackLength
	});
	if (!parseProcess.validateSegmentDataList()) {
		return "The segments data is invalid. Please check it out again in sampleData.js file"
	}

	const timelineSegmentLevel = parseProcess.getTimelineSegmentLevel();
	if (_.isEmpty(timelineSegmentLevel)) {
		return "Can not show timeline segment. There is something wrong in source code.";
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