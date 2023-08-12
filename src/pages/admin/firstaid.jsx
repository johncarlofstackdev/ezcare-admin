import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import { DialogActions, DialogTitle, Snackbar, Alert, Dialog, DialogContent, DialogContentText, Button } from "@mui/material";

import Wrapper from "../../components/Wrapper"
import Preloader from "../../components/Preloader"
import { MainHead, MainAside, MainContentWrapper, MainFooter } from "../../theme/Theme"

import { TextField, Box, Divider } from '@mui/material';

// componenets
import ListOfVerified from './components/firsaid/listofusers';
import Information from './components/firsaid/viewInformation';
import { db } from "../../config";

import AmbulanceNotification from "../../components/notification";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const Firstaid = () => {
    const [value, setValue] = React.useState(0);
    const [seraching, serachingSet] = React.useState("");
    const [seraching2, serachingSet2] = React.useState("");
    const [viewCheck, viewCheckSet] = React.useState({ status: false, reference: null });
    const [snacBar, snacBarSet] = React.useState({ status: false, message: "" });
    const [acceptCofrimation, acceptCofrimationSet] = React.useState(false);
    const [checkEdit, checkEditSet] = React.useState(false);

    const [newData, newDataSet] = React.useState({ fullname: "", phone: "" });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const viewInfo = React.useCallback((event) => {
        const uid = event.target.getAttribute("data-uid");
        viewCheckSet({ status: true, reference: uid });
    }, []);

    const verifyConfirm = React.useCallback(() => {
        acceptCofrimationSet(true);
    }, []);


    const activate = React.useCallback(async () => {
        try {
            await db.ref("aid_provider/" + viewCheck.reference + "/").update({ status: true });
            snacBarSet({ status: true, message: "User Successfully Activated" });
        } catch (error) {
            alert("ERROR: ", error);
        }
    }, [viewCheck]);

    const deactivate = React.useCallback(async () => {
        try {
            await db.ref("aid_provider/" + viewCheck.reference + "/").update({ status: false });
            snacBarSet({ status: true, message: "User Successfully Deactivated" });
        } catch (error) {
            alert("ERROR: ", error);
        }
    }, [viewCheck]);


    // For: Snack Bar Event
    const handleClose = () => {
        snacBarSet({ status: false, message: "" });
    }

    const handleCloseConfirm = () => {
        acceptCofrimationSet(false);
    }

    // For: Confirmation Dialog Event

    const verify = async () => {
        try {
            await db.ref("aid_provider/" + viewCheck.reference + "/").update({ verified_status: true });
            acceptCofrimationSet(false);
            viewCheckSet({ status: false, reference: null });
            snacBarSet({ status: true, message: "User successfully mark as verified" });
        } catch (error) {
            console.log("Error while upadting status: ", error);
        }
    }

    // For: Editing Area
    const EditInformation = React.useCallback(() => {
        checkEditSet(true);
    }, []);

    const CancelEditInformation = React.useCallback(() => {
        checkEditSet(false);
    }, []);


    const handleInputChange = React.useCallback((event) => {
        const { name, value } = event.target;
        const newItems = { ...newData };
        newItems[name] = value;
        newDataSet(newItems);
    }, [newData]);

    const updateProfile = React.useCallback(async () => {
        try {
            await db.ref("aid_provider/" + viewCheck.reference + "/").update(newData);
            checkEditSet(false);
            snacBarSet({ status: true, message: "Successfully updated Profile Information" });
            newDataSet({ fullname: "", phone: "" });
        } catch (error) {
            console.log("Error while upadting status: ", error);
        }
    }, [viewCheck, newData]);

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
                            <h2>MANAGE USERS</h2>
                            <h3>AID PROVIDER</h3>
                            <Box sx={{ width: '100%', marginTop: 5 }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
                                        textColor="primary"
                                        indicatorColor="primary"
                                    >
                                        <Tab label="VEREFIED ACCOUNTS" {...a11yProps(0)} />
                                        <Tab label="PENDING ACOUNTS" {...a11yProps(1)} />
                                    </Tabs>
                                </Box>
                                <TabPanel value={value} index={0}>
                                    <div className="search-area">
                                        <TextField
                                            label="Search User by Code"
                                            id="outlined-size-small"
                                            size="small"
                                            color="error"
                                            onChange={(e) => serachingSet(e.target.value)}
                                            focused
                                        />
                                    </div>
                                    <Divider />
                                    <ListOfVerified search={seraching} verfiedStats={true} viewInfo={viewInfo} current={viewCheck} />
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <div className="search-area">
                                        <TextField
                                            label="Search User by Code"
                                            id="outlined-size-small"
                                            size="small"
                                            color="error"
                                            onChange={(e) => serachingSet2(e.target.value)}
                                            focused
                                        />
                                    </div>
                                    <Divider />
                                    <ListOfVerified search={seraching2} verfiedStats={false} viewInfo={viewInfo} current={viewCheck} />
                                </TabPanel>
                            </Box>
                        </div>
                    </div>
                    <div className="left-content">
                        <Information viewStatus={viewCheck} verify={verifyConfirm} activate={activate} deactivate={deactivate} snacbar={snacBar} editInfo={EditInformation} editIfoState={checkEdit} cancelEdit={CancelEditInformation} newDataState={newData} onChangeInput={handleInputChange} updateProfile={updateProfile} />
                    </div>
                </MainContentWrapper>
                <MainFooter />
            </Wrapper>
            <Snackbar open={snacBar.status} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {snacBar.message}
                </Alert>
            </Snackbar>
            <Dialog
                open={acceptCofrimation}
                onClose={handleCloseConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Cofirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure do you want to verfied this user? You won't be able to un-verify this users once verified.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm}>Cancel</Button>
                    <Button onClick={verify} color="error" autoFocus>
                        Yes, verfied this user
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Firstaid