import * as React from "react";

import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import { db } from "../../../../config";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';


const List = (props) => {
    const { search, view, data } = props;

    const [foundRecord, foundRecordSet] = React.useState({ searching: false, data: {} });
    const objecKeys = Object.keys(foundRecord.data);

    React.useEffect(() => {
        let rootRef = "";
        if (search === "") {
            const ref = "report/";
            rootRef = db.ref(ref);
        } else {
            rootRef = db.ref("report/").orderByChild("code").startAt(search).endAt(search + "\uf8ff");
        }

        rootRef.on("value", async snap => {
            if (!snap.exists()) {
                foundRecordSet({ searching: true, data: {} });
                return false;
            }

            const bugsReport = snap.val();
            const data = {};

            for (const keyName in bugsReport) {
                // const ref
                const userDataRef = db.ref("aid_provider/" + bugsReport[keyName].uid + "/");
                const userDataRun = await userDataRef.once("value");
                
                let userDataRes = null;

                if(userDataRun.exists()){
                    userDataRes = userDataRun.val();
                }else{
                    const userDataRef2 = db.ref("aid_seeker/" + bugsReport[keyName].uid + "/");
                    const userDataRun2 = await userDataRef2.once("value");
                    userDataRes = userDataRun2.val();
                }

                bugsReport[keyName].userInfo = userDataRes;
                bugsReport[keyName].date_added = moment(bugsReport[keyName].date_added, "MM/DD/YYYY").format("MMMM D, YYYY");

                data[keyName] = bugsReport[keyName];
            }

            foundRecordSet({ searching: true, data: data });
        });
    }, [search]);

    return (
        <div className="list-of-reported">
            {!foundRecord.searching ? (
                <div className="loaadinger">
                    <CircularProgress color="error" />
                </div>
            ) : objecKeys.length !== 0 ?
                objecKeys.map((keyName, i) => (
                    <div className={data.key === keyName ? "list-holder-bugs active" : "list-holder-bugs"} key={i}>
                        <div className="reporter-name">
                            <label>Report Code: {foundRecord.data[keyName].code}</label>
                            <h3>{foundRecord.data[keyName].userInfo.fullname}#{foundRecord.data[keyName].userInfo.code}</h3>
                        </div>
                        <div className="date-reported">
                            <h3>Reported on {foundRecord.data[keyName].date_added}</h3>
                        </div>
                        <div className="action-report">
                            <Button variant="contained" color="error" onClick={() => view({...foundRecord.data[keyName], key: keyName})}>
                                View
                            </Button>
                        </div>
                    </div>
                )) : (
                    <div className="no-result-found">
                        <div className="sad-face">
                            <SentimentDissatisfiedIcon color="error" sx={{ fontSize: 90 }} />
                        </div>
                        <div className="message-no-result-msg">
                            Sorry, no records found was your trying to find.
                        </div>
                    </div>
                )}
        </div>
    );
};

export default React.memo(List);