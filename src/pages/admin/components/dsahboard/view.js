
import * as React from "react";

import moment from "moment";

import EmptyView from "../firsaid/empty";
import { db } from "../../../../config";
import ViewProgress from "../firsaid/loaderView";
import Details from "./details";

import fetchAddress from "../../../../components/converToAddress";

const ViewReport = ({ currentEvenId }) => {
    const [incedentDetail, incedentDetailSet] = React.useState({ status: false, data: {} });

    React.useEffect(() => {
        if (!currentEvenId.status) {
            incedentDetailSet({ status: false, data: {} });
            return;
        }

        incedentDetailSet({ status: false, data: {} });

        const fetchIncidentDetails = async () => {
            const incidentRef = db.ref(`incedent/${currentEvenId.reference}`);
            const incidentSnapshot = await incidentRef.once('value');

            if (!incidentSnapshot.exists()) {
                incedentDetailSet({ status: false, data: {} });
                return;
            }

            const { aid_seeker_id, aid_provider_id, location, time } = incidentSnapshot.val();

            const aidSeekerRef = db.ref(`aid_seeker/${aid_seeker_id}`);
            const aidProviderRef = db.ref(`aid_provider/${aid_provider_id}`);

            const [aidSeekerSnapshot, aidProviderSnapshot, formattedAddress] = await Promise.all([
                aidSeekerRef.once('value'),
                aidProviderRef.once('value'),
                fetchAddress(location.latitude, location.longitude)
            ]);


            const incidentDetails = {
                ...incidentSnapshot.val(),
                seeker_information: aidSeekerSnapshot.val(),
                provider_information: aidProviderSnapshot.val(),
                AddressDetails: formattedAddress
            };

            incidentDetails.time = moment(time, "HH:mm").format("h:mm A");

            incedentDetailSet({ status: true, data: incidentDetails });
        }

        fetchIncidentDetails();
    }, [currentEvenId]);

    return (
        !currentEvenId.status ? <EmptyView /> : (!incedentDetail.status ? <ViewProgress /> : <Details data={incedentDetail.data} />)
    );
};

export default React.memo(ViewReport);