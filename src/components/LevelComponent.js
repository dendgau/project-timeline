import React from "react";
import _ from "lodash";
import SegmentComponent from "./SegmentComponent";

const LevelComponent = ({segments, totalTrackLength}) => {
    if (_.isEmpty(segments)) {
        return "";
    }

    return (
        <div className="level">
            {
                segments.map((item, index) => 
                    <SegmentComponent key={index} {...item} totalTrackLength={totalTrackLength}/>
                )
            }
        </div>
    )
}

export default LevelComponent;

