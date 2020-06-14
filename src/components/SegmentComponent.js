import React from "react";

const SegmentComponent = ({id, start, end, totalTrackLength}) => {
	// Calculate position and width of segment in level with %
	const style = {
		left: (start * 100 / totalTrackLength) + "%",
		width: ((end - start) * 100 / totalTrackLength) + "%"
	};

    return (
    	<div className="segment" style={style}>
			<span className="number identify">ID: { id }</span>
			<span className="number left">{ start }</span>
			<span className="number right">{ end }</span>
		</div>
	)
}

export default SegmentComponent;

