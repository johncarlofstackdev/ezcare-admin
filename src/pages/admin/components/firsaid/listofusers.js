import * as React from 'react';

import {
    Pagination, Stack, TextField, CircularProgress, Button, Snackbar, Alert, Box, Avatar
} from '@mui/material';

import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import moment from 'moment';
import { db, storage } from '../../../../config';

const getFileUrl = async (fileRef) => {
    try {
        const url = await storage.ref().child(fileRef).getDownloadURL();
        return url;
    } catch (err) {
        console.log('Error getting download URL: ', err);
    }
}

const ListOfVerified = ({ search, verfiedStats, viewInfo, current }) => {

    const [foundRecord, foundRecordSet] = React.useState({ searching: false, data: {} });

    React.useEffect(() => {
        let rootRef = "";
        if (search === "") {
            const ref = "aid_provider/";
            rootRef = db.ref(ref);
        } else {
            rootRef = db.ref("aid_provider").orderByChild("code").startAt(search).endAt(search + "\uf8ff");
        }

        rootRef.on('value', async snap => {
            if (!snap.exists()) {
                foundRecordSet({ searching: true, data: {} });
                return false;
            }

            const userDataInfo = snap.val();
            const data = {};

            for (const keyName in userDataInfo) {
                const profileData = userDataInfo[keyName].profile;
                const urlPath = await getFileUrl(`profile/${profileData ? profileData : 'index.jpg'}`);
                let date_added = userDataInfo[keyName].data_added;
                userDataInfo[keyName].profile = urlPath;
                userDataInfo[keyName].data_added = moment(date_added, "MM/DD/YYYY").format("MMMM D, YYYY");
                if (verfiedStats) {
                    if (userDataInfo[keyName].verified_status) {
                        data[keyName] = userDataInfo[keyName];
                    }
                } else {
                    if (!userDataInfo[keyName].verified_status) {
                        data[keyName] = userDataInfo[keyName];
                    }
                }
            }

            foundRecordSet({ searching: true, data: data });
        });
    }, [search]);

    return (
        <>
            <div className="list-users">
                {!foundRecord.searching ? (
                    <div className="loaadinger">
                        <CircularProgress color="error" />
                    </div>
                ) : (
                    Object.keys(foundRecord.data).length === 0 ? (
                        <div className="no-result-found">
                            <div className="sad-face">
                                <SentimentDissatisfiedIcon color="error" sx={{ fontSize: 90 }} />
                            </div>
                            <div className="message-no-result-msg">
                                Sorry, no records found was your trying to find.
                            </div>
                        </div>
                    ) : (
                        Object.keys(foundRecord.data).map((keyName, i) => (
                            <div className={current.reference === keyName ? "user-card active" : "user-card" } key={i}>
                                <div className="mg">
                                    <Avatar
                                        alt={foundRecord.data[keyName].fullname}
                                        src={foundRecord.data[keyName].profile}
                                        sx={{ width: 56, height: 56 }}
                                    />
                                    <div className="users-content">
                                        <h4>{foundRecord.data[keyName].fullname} <span className="circle-after-name"></span> {foundRecord.data[keyName].status ? (<span className="acitve-staus-user activer-user">active user</span>) : (<span className="acitve-staus-user deactivate-user">deactivated user</span>)} </h4>
                                        <span style={{ fontSize: 13 }}>ID: <b>{foundRecord.data[keyName].code}</b></span>
                                        <span style={{ marginTop: 5 }}>Joined on {foundRecord.data[keyName].data_added}</span>
                                    </div>
                                    <Button variant="contained" color="error" data-uid={keyName} onClick={viewInfo}>
                                        View
                                    </Button>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </>
    );
}

export default React.memo(ListOfVerified);