
import * as React from "react";

import { Button, Divider } from "@mui/material";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { db } from "../../../../config";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Empty from "./empty";
import Loader from "./loader";

import moment from "moment";

const ListOfIncident = (props) => {
    const { view, currentActive, changeDate, orderDate } = props;

    const [foundRecord, foundRecordSet] = React.useState({ searching: false, data: {} });
    const objecKeys = Object.keys(foundRecord.data);
    const currentDay = new Date().toLocaleDateString();

    React.useEffect(() => {
        const ref = "incedent/";
        const rootRef = db.ref(ref);
        rootRef.on('value', async snap => {
            if (!snap.exists()) {
                foundRecordSet({ searching: true, data: {} });
                return;
            }

            const response = snap.val();

            const filterData = {};

            for (const keyName in response) {
                if (response[keyName].status !== 4) continue;
                if (response[keyName].date_requested !== orderDate) continue;
                response[keyName].time = moment(response[keyName].time, "HH:mm").format("h:mm A");
                filterData[keyName] = response[keyName];
            }

            foundRecordSet({ searching: true, data: filterData });
        });
    }, [currentActive, orderDate]);

    return (

        <div className="listOfReport-holder">
            <div className="date-sorting">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker color="error" onChange={changeDate} inputFormat="MM/DD/YYYY" />
                </LocalizationProvider>
            </div>
            <h3>{currentDay === orderDate ? "Today" : "Sorting on " + moment(orderDate, "MM/DD/YYYY").format("MMMM D, YYYY")}</h3>
            <Divider />
            {!foundRecord.searching ? (
                <Loader />
            ) : objecKeys.length !== 0 ?
                objecKeys.map((keyName, i) => (
                    <div className={keyName === currentActive.reference ? "list-container active" : "list-container"} key={i}>
                        <div className="report-id">
                            <label>Rerport ID</label>
                            <h3>INCIDENT#{foundRecord.data[keyName].incedent_code}</h3>
                        </div>
                        <div className="time">
                            <label>Time</label>
                            <h3>{foundRecord.data[keyName].time}</h3>
                        </div>
                        <div className="type">
                            <label>Type</label>
                            <h3>{foundRecord.data[keyName].event_type}</h3>
                        </div>
                        <div className="action">
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

export default React.memo(ListOfIncident)