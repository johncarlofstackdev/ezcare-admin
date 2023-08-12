import * as React from "react";

const Details = ({ data }) => {
    return (
        <div className="incedent-content">
            <div className="view-profile-area">
                <h1>Incident Information</h1>
                <div className="incident-details">
                    <div className="theme-2-column for-checker">
                        <div>
                            <label>Incident ID</label>
                            <h3>#{data.incedent_code}</h3>
                        </div>
                        <div>
                            <label>Time</label>
                            <h3>{data.time}</h3>
                        </div>
                    </div>
                    <div className="them-1-column for-checker">
                        <div>
                            <label>Distress Signal ID</label>
                            <h3>{data.seeker_information.fullname}#{data.seeker_information.code}</h3>
                        </div>
                    </div>
                    <div className="theme-2-column for-checker">
                        <div>
                            <label>Age</label>
                            <h3>{data.seeker_information.age}</h3>
                        </div>
                        <div>
                            <label>Gender</label>
                            <h3>{data.seeker_information.gender}</h3>
                        </div>
                    </div>
                    <div className="them-1-column for-checker">
                        <div>
                            <label>Location</label>
                            <h3>{data.AddressDetails.address}</h3>
                        </div>
                    </div>
                    <div className="them-1-column for-checker">
                        <div>
                            <label>Ambulance Request</label>
                            <h3>{!data.ambulance_Request ? "NONE" : "Reference# " + data.ambulance_Request}</h3>
                        </div>
                    </div>
                    <div className="them-1-column for-checker">
                        <div>
                            <label>Event Type</label>
                            <h3>{data.event_type}</h3>
                        </div>
                    </div>
                    <div className="them-1-column for-checker">
                        <div>
                            <label>Event Details</label>
                            <h3>{data.event_details}</h3>
                        </div>
                    </div>
                    <div className="them-1-column for-checker">
                        <div>
                            <label>First Aider</label>
                            <h3>{data.provider_information.fullname}#{data.provider_information.code}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Details)