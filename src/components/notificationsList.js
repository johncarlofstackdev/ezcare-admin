import * as React from "react";
import NotificationEmpty from "../img/notification-icon.png";

import { Avatar } from "@mui/material";

import { db } from "../config";

import FileFetcher from "./fileFetcher";
import RealTime from "./timeAgoRealtime";

import moment from "moment";

const ListOfNotificaitons = () => {

    const [data, dataSet] = React.useState(true);
    const objecKeys = Object.keys(data);

    React.useEffect(() => {
        const ref = db.ref("ambulance/");
        ref.on("value", async snap => {
            if (!snap.exists()) {
                dataSet(false);
                return;
            }

            const response = snap.val();
            let responseArr = [];

            for (const keyName in response) {
                const ref = "aid_provider/" + response[keyName].provider_id + "/";
                const userDataRef = db.ref(ref);
                const aidProvider = await userDataRef.once("value");
                response[keyName].provider_id = aidProvider.val();
                const profileStats = response[keyName].provider_id.profile;
                response[keyName].provider_id.profile = await FileFetcher(`profile/${profileStats ? profileStats : 'index.jpg'}`);
                response[keyName].timestamp = moment(`${response[keyName].date_requested} ${response[keyName].time}`, "M/D/YYYY H:mm").valueOf();
                responseArr = [...responseArr, response[keyName]];
            }

            responseArr.sort((a, b) => b.timestamp - a.timestamp);
            dataSet(responseArr);

            // console.log(responseArr);
            // const filtered = Object.entries(response).map(([key, value]) => ({key,...value,
            //     ,
            // }));
        });
    }, []);

    if (!data) {
        return (
            <div className="Empty-Notigication-container">
                <div>
                    <img src={NotificationEmpty} alt="Empty" />
                    <h3 style={{ color: "#a56363" }}>NO NOTIFICATION</h3>
                </div>
            </div>
        );
    }

    return (
        <>
            <h3>Notifications</h3>
            <div className="list-notification-holder">
                {objecKeys.map((keyName, i) => (
                    <div className="list-notification-area" key={i}>
                        <div className="notificaiton-mg">
                            <Avatar
                                alt="Avatar"
                                src={data[keyName].provider_id.profile}
                                sx={{ width: 56, height: 56 }}
                            />
                            <div className="detials-notifications">
                                <h4>{data[keyName].provider_id.fullname}</h4>
                                <p>requested an ambulance</p>
                                <span><RealTime dateRequested={data[keyName].date_requested} timeRequested={data[keyName].time} /></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};


export default React.memo(ListOfNotificaitons);