import * as React from "react";

import {
    Pagination, Stack, TextField, CircularProgress, Button, Snackbar, Alert, Box, Divider, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, Avatar
} from "@mui/material";

const UnVerfiedView = ({ data, verify, download }) => {
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
                <Button variant="contained" color="success" onClick={verify}>
                    verify
                </Button>
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
                    label="Pr"
                    value={data.serviceType == 1 ? "First Aider" : data.serviceType == 2 ? "Police" : "Bureau of fire protection"}
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
                    value={data.fullname}
                    InputProps={{
                        readOnly: true,
                    }}
                    variant="filled"
                    color="error"
                    name="fullname"
                    sx={{ mt: 2 }}
                    fullWidth
                />
                <TextField
                    id="filled-read-only-input"
                    label="Phone Number"
                    value={data.phone}
                    InputProps={{
                        readOnly: true,
                    }}
                    variant="filled"
                    color="error"
                    name="phone"
                    sx={{ mt: 2, mb: 2 }}
                    // onChange={(e) => { setPhone(e.currentTarget.value) }}
                    fullWidth
                />
                <Divider />
                <div style={{ marginTop: 10, fontWeight: 600 }}>
                    ATTACHMENT
                </div>
                <Button variant="contained" style={{ width: '100%', height: 50, marginTop: 10 }} color="error" onClick={download}>
                    download file
                </Button>
            </Box>
        </div >
    );
}

export default React.memo(UnVerfiedView);