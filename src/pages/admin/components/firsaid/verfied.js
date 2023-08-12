import * as React from "react";

import {
    Pagination, Stack, TextField, CircularProgress, Button, Snackbar, Alert, Box, Divider, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, Avatar
} from "@mui/material";

const VerifedView = ({ data, download, activate, deactivate, editInfo, editIfoState, cancelEdit, newDataState, onChangeInput, updateProfile }) => {
    return (
        <div className="view-profile-area">
            <h1>Account Information</h1>
            <div className="acount-info-profile">
                <Avatar
                    alt={data.fullname}
                    src={data.profile}
                    sx={{ width: 56, height: 56 }}
                />
                <div>
                    <span>Aid Provider ID</span>
                    <h3>{data.code}</h3>
                </div>
                {data.status ? (
                    <Button variant="contained" color="error" onClick={deactivate}>
                        DEACTIVATE
                    </Button>
                ) : (
                    <Button variant="contained" color="success" onClick={activate}>
                        ACTIVATE
                    </Button>
                )
                }
            </div>
            <Box>
                <TextField
                    id="filled-read-only-input"
                    label="Email Address"
                    value={data.email}
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
                    label="Profession"
                    value={data.serviceType == 1 ? "First Aider" : data.serviceType == 2 ? "Police" : "Bureau of fire protection"}
                    InputProps={{
                        readOnly: true,
                    }}
                    variant="filled"
                    color="error"
                    name="email"
                    sx={{ mt: 2 }}
                    fullWidth
                />
                <TextField
                    id="filled-read-only-input"
                    label="Full Name"
                    value={!editIfoState ? data.fullname : newDataState.fullname}
                    name="fullname"
                    InputProps={{
                        readOnly: !editIfoState,
                    }}
                    variant="filled"
                    color="error"
                    onChange={onChangeInput}
                    sx={{ mt: 2 }}
                    fullWidth
                />
                <TextField
                    id="filled-read-only-input"
                    label="Phone Number"
                    value={!editIfoState ? data.phone : newDataState.phone}
                    name="phone"
                    InputProps={{
                        readOnly: !editIfoState,
                    }}
                    variant="filled"
                    color="error"
                    onChange={onChangeInput}
                    sx={{ mt: 2, mb: 2 }}
                    // onChange={(e) => { setPhone(e.currentTarget.value) }}
                    fullWidth
                />
                {!editIfoState ? (
                    <Button variant="contained" color="primary" style={{ marginBottom: 20 }} onClick={editInfo}>
                        Edit information
                    </Button>
                ) : (
                    <Stack direction="row" spacing={1} style={{ marginBottom: 20 }}>
                        <Button variant="contained" color="success" onClick={updateProfile}>
                            Save Changes
                        </Button>
                        <Button variant="outline" color="error" onClick={cancelEdit}>
                            Cancel
                        </Button>
                    </Stack>
                )}
                <Divider />
                <div style={{ marginTop: 10, fontWeight: 600 }}>
                    ATTACHMENT
                </div>
                <Button variant="contained" style={{ width: '100%', height: 50, marginTop: 10 }} color="error" onClick={download}>
                    download file
                </Button>
            </Box>
            {/* <Dialog
                open={acceptCofrimation}
                onClose={closeConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you do you want to mark as Verfied this user? You won't be able revert this once verified. But still you can deactivate this user so they won't be able to access the application.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirm} color="error">Cancel</Button>
                    <Button onClick={verify} autoFocus>
                        Yes, Verify
                    </Button>
                </DialogActions>
            </Dialog> */}
        </div >
    );
}

export default React.memo(VerifedView);