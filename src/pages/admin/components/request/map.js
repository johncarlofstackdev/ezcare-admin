import * as React from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import customMarker from "../../../../img/aid_provider_(3)_50_x_50.png";
import { Button } from "@mui/material";
import ControlPointIcon from '@mui/icons-material/ControlPoint';

const Map = (props) => {

    const { data, accept } = props;
    const { location } = data.event_data;
    const center = { lat: location.latitude, lng: location.longitude };

    const Marker = {
        url: customMarker,
        scaledSize: new window.google.maps.Size(50, 50),
    };

    return (
        <div className="request-container-controller">
            <GoogleMap zoom={20} center={center} mapContainerClassName="map-container">
                <MarkerF position={center} icon={Marker} />
            </GoogleMap>
            <div className="request-information-container">
                <h3>Request Information</h3>
                <div className="request-colum-2">
                    <div>
                        <label>Request ID</label>
                        <h2>#{data.code}</h2>
                    </div>
                    <div>
                        <label>Time</label>
                        <h2>11:55 PM</h2>
                    </div>
                </div>
                <div className="request-colum-1">
                    <div>
                        <label>Location</label>
                        <h2>{data.location.address}</h2>
                    </div>
                </div>
                <div className="request-colum-1">
                    <div>
                        <label>First Aider</label>
                        <h2>{data.userInfo.fullname} #{data.userInfo.code}</h2>
                    </div>
                </div>
                <div className="action">
                    {
                        !data.status ? (
                            <Button
                                variant="contained"
                                style={{ width: '100%', height: 50, marginTop: 10 }}
                                endIcon={<ControlPointIcon />} color="success"
                                onClick={accept}
                            >
                                accept request
                            </Button>
                        ) : ""
                    }
                </div>
            </div>
        </div>
    );
};

export default React.memo(Map);