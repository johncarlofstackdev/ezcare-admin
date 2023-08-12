import * as React from "react";

import Wrapper from "../../components/Wrapper"
import Preloader from "../../components/Preloader"
import { MainHead, MainAside, MainContentWrapper, MainFooter } from "../../theme/Theme"
// import Content_Layout from "../content/admin/dashboard"

import { Divider, TextField, Snackbar, Alert } from "@mui/material"

import Tab from "./components/request/tab";
import View from "./components/request/view";
import List from "./components/request/list";

import { db } from "../../config";

import AmbulanceNotification from "../../components/notification";

const Request = () => {
    const [activeRef, activeRefSet] = React.useState({ type: 1, label: "All Request" });
    const [totalRequest, totalRequestSet] = React.useState({ all: 0, pending: 0, completed: 0 });
    const [currentViewRef, currentViewRefSet] = React.useState(false);

    const [snacBar, snacBarSet] = React.useState({ status: false, message: "" });

    const [search, searchSet] = React.useState(null);

    const AllRequest = React.useCallback((type, label) => {
        activeRefSet({ type: type, label: label });
    }, []);

    const view = React.useCallback((referenceCode) => {
        currentViewRefSet(referenceCode);
    }, []);

    const acceptRequest = React.useCallback(async () => {
        try {
            await db.ref("ambulance/" + currentViewRef + "/").update({ status: true });
            snacBarSet({ status: true, message: "You have successfully responded to ambulance request." });
        } catch (error) {
            console.log("Error while upadting status: ", error);
        }
    }, [currentViewRef]);

    // For: Snack Bar Event
    const handleClose = () => {
        snacBarSet({ status: false, message: "" });
    }

    return (
        <>
            <AmbulanceNotification />
            <Wrapper>
                <Preloader></Preloader>
                <MainHead />
                <MainAside />
                <MainContentWrapper>
                    <div className="main-conent">
                        <div className="mg">
                            <h2>ambulance request</h2>
                            <div className="tab-action-requesst">
                                <Tab type={{ type: 1, label: "All Request" }} active={activeRef.type} AllRequest={AllRequest} label="ALL" count={totalRequest.all} />
                                <Tab type={{ type: 2, label: "Pending Request" }} active={activeRef.type} AllRequest={AllRequest} label="PENDING" count={totalRequest.pending} />
                                <Tab type={{ type: 3, label: "Completed Request" }} active={activeRef.type} AllRequest={AllRequest} label="ACCEPTED" count={totalRequest.completed} />
                            </div>
                            <h3 className="label-current">{activeRef.label}</h3>
                            <div className="search-area">
                                <TextField
                                    label="Search by Code"
                                    id="outlined-size-small"
                                    size="small"
                                    color="error"
                                    onChange={(e) => searchSet(e.target.value)}
                                    focused
                                />
                            </div>
                            <Divider />
                            <div className="list-of-cotent" style={{ marginTop: 10 }}>
                                <List count={totalRequestSet} status={activeRef.type} search={search} view={view} />
                            </div>
                        </div>
                    </div>
                    <div className="left-content">
                        <View current={currentViewRef} accept={acceptRequest} snacbar={snacBar} />
                    </div>
                </MainContentWrapper>
                <MainFooter />
            </Wrapper>
            <Snackbar open={snacBar.status} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {snacBar.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Request