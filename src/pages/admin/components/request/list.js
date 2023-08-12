import * as React from "react";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { Button } from "@mui/material";
import { db } from "../../../../config";
import Loader from "../dsahboard/loader";
import Empty from "../dsahboard/empty";
import moment from 'moment';

import RealTime from "../../../../components/timeAgoRealtime";

const List = (props) => {
    const { count, status, search, view } = props;
    const [foundRecord, foundRecordSet] = React.useState({ searching: false, data: {} });
    const objecKeys = Object.keys(foundRecord.data);

    React.useEffect(() => {

        const ref = "ambulance/";
        let rootRef = "";
        if (search === null) {
            rootRef = db.ref(ref);
        } else {
            rootRef = db.ref(ref).orderByChild("code").startAt(search).endAt(search + "\uf8ff");
        }

        // const rootRef = db.ref(ref);

        rootRef.on('value', async snap => {
            if (!snap.exists()) {
                foundRecordSet({ searching: true, data: {} });
                // if (search === "" || search === null) {
                    count({ all: 0, pending: 0, completed: 0 });
                // }
                return;
            }

            const response = snap.val();

            const filterData = { all: {}, pending: {}, completed: {} };

            for (const keyName in response) {
                const reference = "aid_provider/" + response[keyName].provider_id + "/";
                const rootRef = db.ref(reference);
                const reponseAP = await rootRef.once("value");
                response[keyName].aidProviderInfo = reponseAP.val();

                if (!response[keyName].status) {
                    filterData.pending[keyName] = response[keyName];
                } else {
                    filterData.completed[keyName] = response[keyName];
                }
                filterData.all[keyName] = response[keyName];
            }

            const DisplayData = status === 1 ? { ...filterData.all } : (status === 2 ? { ...filterData.pending } : { ...filterData.completed });

            // if (search === "" || search === null) {
                count({ all: Object.keys(filterData.all).length, pending: Object.keys(filterData.pending).length, completed: Object.keys(filterData.completed).length });
            // }

            foundRecordSet({ searching: true, data: DisplayData });
        });
    }, [status, search]);

    return (
        <div className="list-area-request">
            {!foundRecord.searching ? (
                <Loader />
            ) : objecKeys.length !== 0 ?
                objecKeys.map((keyName, i) => (
                    <div className="listHolder" key={i}>
                        <div>
                            <p>Request Code: {foundRecord.data[keyName].code}</p>
                            <h3>{foundRecord.data[keyName]["aidProviderInfo"].fullname}#{foundRecord.data[keyName]["aidProviderInfo"].code}</h3>
                            <span><RealTime dateRequested={foundRecord.data[keyName].date_requested} timeRequested={foundRecord.data[keyName].time} /></span>
                        </div>
                        <div>
                            <Button variant="contained" onClick={() => view(keyName)} endIcon={<ArrowCircleRightOutlinedIcon />} color="error">
                                View
                            </Button>
                        </div>
                    </div>
                )) : (
                    <Empty />
                )
            }
        </div>
    );
}

export default React.memo(List);