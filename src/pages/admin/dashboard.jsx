import * as React from "react";

import Wrapper from "../../components/Wrapper";
import Preloader from "../../components/Preloader";
import { MainHead, MainAside, MainContentWrapper, MainFooter } from "../../theme/Theme";

import ListOfIncident from "./components/dsahboard/list";
import ViewReport from "./components/dsahboard/view";

import { db } from '../../config';

import AmbulanceNotification from "../../components/notification";

const Dashboard = () => {
    const [currentId, currentIdSet] = React.useState({ status: false, reference: null });
    const [orderDate, orderDateSet] = React.useState(new Date().toLocaleDateString());

    const ViewInformation = React.useCallback((refereCode) => {
        currentIdSet({ status: true, reference: refereCode });
    }, []);

    const changeDate = React.useCallback((value) => {
        orderDateSet(value.$d.toLocaleDateString());
    }, []);

    const ListOfIncidentProps = {
        view: ViewInformation,
        changeDate: changeDate,
        currentActive: currentId,
        orderDate: orderDate
    };

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
                            <h2>Incident Reports</h2>
                        </div>
                        <ListOfIncident {...ListOfIncidentProps} />
                    </div>
                    <div className="left-content">
                        <ViewReport currentEvenId={currentId} />
                    </div>
                </MainContentWrapper>
                <MainFooter />
            </Wrapper>
        </>
    )
}

export default Dashboard