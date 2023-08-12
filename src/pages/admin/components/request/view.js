import * as React from "react";
import EmptyView from "../firsaid/empty";
import { db } from "../../../../config";
import { useLoadScript } from "@react-google-maps/api";
import Loader from "../dsahboard/loader";
import Map from "./map";

import fetchAddress from "../../../../components/converToAddress";

const View = (props) => {
    const { current, accept, snacbar } = props;
    const [data, dataSet] = React.useState({});

    React.useEffect(() => {
        const fetchData2 = async () => {
            const requesttRef = db.ref(`ambulance/${current}/`);
            const requestSnap = await requesttRef.once("value");

            if (!requestSnap.exists()) {
                dataSet({});
                return;
            }

            const requestResponse = requestSnap.val();

            const inceDentRef = db.ref(`incedent/${requestResponse.event_id}/`);
            const inceDentSnap = await inceDentRef.once("value");
            const inceDentResponse = inceDentSnap.val();

    
            const userInfoRef = db.ref(`aid_provider/${requestResponse.provider_id}/`);

            const [userInfo, convertedLocation] = await Promise.all([
                userInfoRef.once("value"),
                fetchAddress(inceDentResponse.location.latitude, inceDentResponse.location.longitude)
            ]);

            requestResponse["location"] = convertedLocation;
            requestResponse["event_data"] = inceDentResponse;
            requestResponse["userInfo"] = userInfo.val();

            dataSet(requestResponse);
        };

        fetchData2();
    }, [current, snacbar]);
    
    const { isLoaded } = useLoadScript({ googleMapsApiKey: "AIzaSyBg9J9ixxZ9Y6Gawijfw52i_EM801DHgts" });

    if (!current) {
        return (
            <EmptyView />
        );
    }

    if (!isLoaded || Object.keys(data).length === 0) {
        return (
            <div className="loader-holder-request">
                <Loader />
            </div>
        );
    }

    return (
        <Map data={data} accept={accept} />
    );
};

export default View;