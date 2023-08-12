import Wrapper from "../../components/Wrapper"
import Preloader from "../../components/Preloader"
import { MainHead, MainAside, MainContentWrapper, MainFooter } from "../../theme/Theme"
// import Content_Layout from "../content/admin/dashboard"

import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

import React, { useEffect, useState, useCallback } from 'react';

import {
    Pagination, Stack, TextField, CircularProgress, Button, Snackbar, Alert, Box, Avatar, FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { db, storage } from "../../config";

import {
    Divider
} from '@mui/material'

// image
import empty from "../../img/empty.png";

import AmbulanceNotification from "../../components/notification";

import moment from "moment";

const getFileUrl = async (fileRef) => {
    try {
        const url = await storage.ref().child(fileRef).getDownloadURL();
        return url;
    } catch (err) {
        console.log('Error getting download URL: ', err);
    }
}

const Users = () => {
    const [listUser, listUserData] = useState({})
    const [checkList, setCheckList] = useState(false)
    const [viewProfile, setViewProfile] = useState(false)
    const [userId, setUserId] = useState('')

    const [confirmActi, setConfirmActi] = useState(false)
    const [confirmDeact, setConfirmDeact] = useState(false)
    const [currentUser, setCurrentUser] = useState('')

    const [snacBarActiDeac, setSnacBarActiDeac] = useState(false)
    const [snacBarActiDeacMes, setSnacBarActiDeacMes] = useState('')

    const [checkEdit, setCheckEdit] = useState(true)

    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [date, setDate] = useState('');

    const [searchResults, setSearchResults] = useState('');

    // useEffect(() => {
    //     const ref = 'aid_seeker/'
    //     const rootRef = db.ref(ref)
    //     // const fetchData = async () => {
    //         let userDataInfo = rootRef.once('value').val()

    //         for (const keyName in userDataInfo) {
    //             const profileData = userDataInfo[keyName].profile
    //             const urlPath = getFileUrl(`profile/${profileData ? profileData : 'index.jpg'}`)
    //             userDataInfo[keyName].profile = urlPath
    //         }

    //         listUserData(userDataInfo)
    //         setCheckList(true)
    //     // }
    //     // fetchData()
    // }, [])

    useEffect(() => {
        let rootRef = ""
        if (searchResults === "") {
            const ref = 'aid_seeker/'
            rootRef = db.ref(ref)
        } else {
            rootRef = db.ref("aid_seeker").orderByChild("code").startAt(searchResults).endAt(searchResults + "\uf8ff")
        }
        rootRef.on('value', snap => {
            const userDataInfo = snap.val()
            if (userDataInfo === null) {
                listUserData({})
                setCheckList(true)
            } else {
                const fetchFileData = async () => {
                    for (const keyName in userDataInfo) {
                        const profileData = userDataInfo[keyName].profile
                        const urlPath = await getFileUrl(`profile/${profileData ? profileData : 'index.jpg'}`);
                        userDataInfo[keyName].data_added = moment(userDataInfo[keyName].data_added, "MM/DD/YYYY").format("MMMM D, YYYY");
                        userDataInfo[keyName].profile = urlPath
                    }
                }
                fetchFileData().then(() => {
                    listUserData(userDataInfo)
                    setCheckList(true)
                })
            }
        })
    }, [searchResults])

    // DEACTIVATE/ACTIVATE START : FUNCTION

    const handleViewProfile = useCallback((e) => {
        setFullname("")
        setPhone("")
        setAge("");
        setGender("");
        setDate("");
        const uid = e.target.getAttribute('data-uid')
        setViewProfile(true)
        setUserId(uid)
    }, [])

    const handleConfirmActi = (e) => {
        const uid = e.target.getAttribute('data-uid')
        setCurrentUser(uid)
        setConfirmActi(true)
    }

    const handleActiEvent = () => {
        setSnacBarActiDeacMes('User Successfully Activated.')
        const ref = db.ref(`aid_seeker/${currentUser}/status`);
        ref.set(true).then(() => {
            setConfirmActi(false)
            setSnacBarActiDeac(true)
        }).catch((error) => {
            console.log("Error updating status:", error);
        })
    }

    const handleConfirmActiClose = () => {
        setConfirmActi(false)
    }

    const handleConfirmDeact = (e) => {
        setSnacBarActiDeacMes('User Successfully Deactivated.')
        const uid = e.target.getAttribute('data-uid')
        setCurrentUser(uid)
        setConfirmDeact(true)
    }

    const handleDeactEvent = () => {
        const ref = db.ref(`aid_seeker/${currentUser}/status`);
        ref.set(false).then(() => {
            setConfirmDeact(false)
            setSnacBarActiDeac(true)
        }).catch((error) => {
            console.log("Error updating status:", error);
        })
    }

    const handleConfirmDeactClose = () => {
        setConfirmDeact(false)
    }

    const handleCloseSnacBar = () => {
        setSnacBarActiDeac(false)
    }

    // DEACTIVATE/ACTIVATE END : FUNCTION

    // EDIT USER START : FUCNTION

    const handleEditInfo = () => {
        setCheckEdit(false)
        setSnacBarActiDeacMes('Successfully Updated Information.')
    }

    const handleEditCancel = () => {
        setFullname("")
        setPhone("")
        setAge("");
        setGender("");
        setDate("");
        setCheckEdit(true)
    }

    const HandlerUpdateEvent = (event) => {
        event.preventDefault()
        const uid = event.target.getAttribute('data-uid')
        const updates = { 
            'fullname': fullname === "" ? listUser[uid].fullname : fullname, 
            'phone': phone === "" ? listUser[uid].phone : phone,
            'gender': gender === "" ? listUser[uid].gender : gender,
            'age': age === "" ? listUser[uid].age : age,
            'dateOfBirth': date === "" ? listUser[uid].dateOfBirth : date,
        }
        db.ref(`aid_seeker/${uid}`).update(updates).then(() => {
            setSnacBarActiDeac(true)
            setCheckEdit(true)
        }).catch((error) => {
            console.log("Error updating information:", error);
        })
    }

    const handleSearch = (value) => {
        setSearchResults(value)
        setCheckList(false)
    }

    const viewProfileHTML = useCallback(() => {
        return (
            <div className="view-profile-area">
                <h1>Account Information</h1>
                <div className="acount-info-profile">
                    <Avatar
                        alt={listUser[userId].fullname}
                        src={listUser[userId].profile}
                        sx={{ width: 56, height: 56 }}
                    />
                    <div>
                        <span>Aid Seeker ID</span>
                        <h3>{listUser[userId].code}</h3>
                    </div>
                    {listUser[userId].status ? (
                        <Button variant="contained" data-uid={userId} color="error" onClick={handleConfirmDeact}>
                            DEACTIVATE
                        </Button>
                    ) : (
                        <Button variant="contained" data-uid={userId} color="success" onClick={handleConfirmActi}>
                            ACTIVATE
                        </Button>
                    )
                    }
                </div>
                <Box>
                    {/* <div className="account-form-control">
                        <label htmlFor="">Full Name</label>
                        <input type="text" value={listUser[userId].fullname} disabled />
                    </div>
                    <div className="account-form-control">
                        <label htmlFor="">Email Address</label>
                        <input type="text" value={listUser[userId].email} disabled />
                    </div>
                    <div className="account-form-control">
                        <label htmlFor="">Phone Number</label>
                        <input type="text" value={listUser[userId].phone} disabled />
                    </div> */}
                    <TextField
                        id="filled-read-only-input"
                        label="Email Address"
                        value={listUser[userId].email}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="filled"
                        color="error"
                        name="email"
                        sx={{ mt: 4 }}
                        fullWidth
                    />
                    <TextField
                        id="filled-read-only-input"
                        label="Full Name"
                        value={checkEdit ? listUser[userId].fullname : fullname}
                        InputProps={{
                            readOnly: checkEdit,
                        }}
                        variant="filled"
                        color="error"
                        name="fullname"
                        sx={{ mt: 2 }}
                        onChange={(e) => { setFullname(e.currentTarget.value) }}
                        fullWidth
                    />
                    <TextField
                        id="filled-read-only-input"
                        label="Phone Number"
                        value={checkEdit ? listUser[userId].phone : phone}
                        InputProps={{
                            readOnly: checkEdit,
                        }}
                        variant="filled"
                        color="error"
                        name="phone"
                        sx={{ mt: 2 }}
                        onChange={(e) => { setPhone(e.currentTarget.value) }}
                        fullWidth
                    />
                    {/* <TextField
                        id="filled-read-only-input"
                        label="Gender"
                        value={checkEdit ? listUser[userId].gender : gender}
                        InputProps={{
                            readOnly: checkEdit,
                        }}
                        variant="filled"
                        color="error"
                        name="gender"
                        sx={{ mt: 2 }}
                        onChange={(e) => { setGender(e.currentTarget.value) }}
                        fullWidth
                    /> */}

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="demo-simple-select-label">Age</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={checkEdit ? listUser[userId].gender : gender}
                            label="Age"
                            onChange={event => setGender(event.target.value)}
                            InputProps={{
                                readOnly: checkEdit,
                            }}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        id="filled-read-only-input"
                        label="Age"
                        value={checkEdit ? listUser[userId].age : age}
                        InputProps={{
                            readOnly: checkEdit,
                        }}
                        variant="filled"
                        color="error"
                        name="phone"
                        sx={{ mt: 2 }}
                        onChange={(e) => { setAge(e.currentTarget.value) }}
                        fullWidth
                    />

                    <TextField
                        id="filled-read-only-input"
                        label="Date of birth"
                        value={checkEdit ? listUser[userId].dateOfBirth : date}
                        InputProps={{
                            readOnly: checkEdit,
                        }}
                        variant="filled"
                        color="error"
                        name="dateOfBirth"
                        sx={{ mt: 2, mb: 2 }}
                        onChange={(e) => { setDate(e.currentTarget.value) }}
                        fullWidth
                    />


                    {checkEdit ? (
                        <Button variant="contained" color="primary" onClick={handleEditInfo}>
                            Edit information
                        </Button>
                    ) : (
                        <Stack direction="row" spacing={1}>
                            <Button variant="contained" color="success" data-uid={userId} onClick={HandlerUpdateEvent}>
                                Save Changes
                            </Button>
                            <Button variant="outline" color="error" onClick={handleEditCancel}>
                                Cancel
                            </Button>
                        </Stack>
                    )}
                </Box>
            </div>
        );
    }, [userId, listUser, checkEdit, fullname, phone, age, gender, date])

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
                            <h3>AID SEEKER</h3>
                            <div className="search-area">
                                <TextField
                                    label="Search User by Code"
                                    id="outlined-size-small"
                                    size="small"
                                    color="error"
                                    onChange={(e) => handleSearch(e.target.value)}
                                    focused
                                />
                            </div>
                            <Divider />
                            <div className="list-users">
                                {!checkList ? (
                                    <div className="loaadinger">
                                        <CircularProgress color="error" />
                                    </div>
                                ) : (
                                    Object.keys(listUser).length === 0 ? (
                                        <div className="no-result-found">
                                            <div class="sad-face">
                                                <SentimentDissatisfiedIcon color="primary" sx={{ fontSize: 90 }} color="error" />
                                            </div>
                                            <div class="message-no-result-msg">
                                                Sorry, no records found was your trying to find.
                                            </div>
                                        </div>
                                    ) : (
                                        Object.keys(listUser).map((keyName, i) => (
                                            <div className="user-card" key={i}>
                                                <div className="mg">
                                                    <Avatar
                                                        alt={listUser[keyName].fullname}
                                                        src={listUser[keyName].profile}
                                                        sx={{ width: 56, height: 56 }}
                                                    />
                                                    <div className="users-content">
                                                        <h4>{listUser[keyName].fullname} <span className="circle-after-name"></span> {listUser[keyName].status ? (<span className="acitve-staus-user activer-user">active user</span>) : (<span className="acitve-staus-user deactivate-user">deactivated user</span>)} </h4>
                                                        <span style={{ fontSize: 13 }}>ID: <b>{listUser[keyName].code}</b></span>
                                                        <span style={{ marginTop: 5 }}>Joined on {listUser[keyName].data_added}</span>
                                                    </div>
                                                    <Button variant="contained" color="error" data-uid={keyName} onClick={handleViewProfile}>
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="left-content">
                        {!viewProfile ? (
                            <div className="empty-content">
                                <div className="empty-container">
                                    <img src={empty.toString()} alt="Emtpy Image" />
                                    <h4>Request information will be displayed here</h4>
                                </div>
                            </div>
                        ) : (Object.keys(listUser).length === 0 ?
                            (
                                <div className="empty-content">
                                    <div className="empty-container">
                                        <img src={empty.toString()} alt="Emtpy Image" />
                                        <h4>Request information will be displayed here</h4>
                                    </div>
                                </div>
                            ) : (
                                viewProfileHTML()
                            )
                        )}
                    </div>
                </MainContentWrapper>
                <MainFooter />
            </Wrapper>
            <Dialog
                open={confirmActi}
                onClose={handleConfirmActiClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmation of changing user's status"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you really wish to activate this users? This user can login the sytem once activated.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmActiClose} color="error">cancel</Button>
                    <Button onClick={handleActiEvent} autoFocus>
                        Yes, activate it!
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={confirmDeact}
                onClose={handleConfirmDeactClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmation of changing user's status"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you really wish to deactivate this users? This user cannot login the sytem once deactivated.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDeactClose} color="error">cancel</Button>
                    <Button onClick={handleDeactEvent} autoFocus>
                        Yes, deactivate it!
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snacBarActiDeac} autoHideDuration={3000} onClose={handleCloseSnacBar}>
                <Alert onClose={handleCloseSnacBar} severity="success" sx={{ width: '100%' }}>
                    {snacBarActiDeacMes}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Users