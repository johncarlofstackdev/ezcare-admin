import * as React from "react";

import Wrapper from "../../components/Wrapper";
import Preloader from "../../components/Preloader";
import { MainHead, MainAside, MainContentWrapper, MainFooter } from "../../theme/Theme";

import { Divider, TextField, Drawer } from "@mui/material";
import AmbulanceNotification from "../../components/notification";
import List from "./components/report/list";
import View from "./components/report/view";

const Dashboard = () => {
    const [seraching, serachingSet] = React.useState("");
    const [data, dataSet] = React.useState(false);

    const ViewReport = React.useCallback((data) => {
        dataSet(data);
    }, [])

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
                            <h2>MANAGE REPORT</h2>
                            <h3>BUGS REPORT</h3>
                        </div>
                        <div className="list-of-report-container">
                            <div className="search-area">
                                <TextField
                                    label="Search by Code"
                                    id="outlined-size-small"
                                    size="small"
                                    color="error"
                                    onChange={(e) => serachingSet(e.target.value)}
                                    focused
                                />
                            </div>
                            <Divider />
                            <List search={seraching} view={ViewReport} data={data} />
                        </div>
                    </div>
                    <div className="left-content">
                        <View data={data} />
                    </div>
                </MainContentWrapper>
                <MainFooter />
            </Wrapper>
        </>
    )
}

export default Dashboard