import * as React from 'react'
import Wrapper from "../components/Wrapper"

// import Divider from '@mui/material/Divider';
// import Typography from '@mui/material/Typography';

import {
    Tooltip, Box, Avatar, MenuItem, ListItemIcon, IconButton, Menu, Link, Divider,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
    Slide, Drawer
} from '@mui/material'

import PersonIcon from '@mui/icons-material/Person'
// import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout'
// import { Person } from '@mui/icons-material';
import { useNavigate, useLocation } from "react-router-dom"

import { auth } from "../config"

import NotificationsList from '../components/notificationsList'
import CheckNoti from '../components/checkNotification'

import { db } from '../config'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const MainHead = () => {
    const navigate = useNavigate()

    const [notification, notificationSet] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const [openConfirm, setOpenCofirm] = React.useState(false);

    const updateNotification = async () => {
        try {
            const ambulanceRef = db.ref("ambulance/");
            const snapshot = await ambulanceRef.once("value");

            if (!snapshot.exists()) {
                notificationSet(true);
                return;
            }

            const response = snapshot.val();

            for (const keyName in response) {
                const ambulanceStatus = response[keyName].status;

                if (!ambulanceStatus) {
                    const ambulanceRef = db.ref(`ambulance/${keyName}/admin_read`);
                    await ambulanceRef.set(true);
                }
            }

            notificationSet(true);
        } catch (error) {
            notificationSet(true);
            console.error(error);
            alert("An error occurred while updating notifications.");
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleConfirmClickOpen = () => {
        setOpenCofirm(true);
    };

    const handleConfirmClose = () => {
        setOpenCofirm(false);
    };


    const handleLogout = () => {
        auth
            .signOut()
            .then(() => {
                navigate('/')
            })
            .catch(error => alert(error.message))
    }
    return (
        <Wrapper.Header className="main-header">
            <Drawer
                anchor="right"
                open={notification}
                onClose={() => notificationSet(false)}
            >
                <div className="headder-notificatino">
                    <NotificationsList />
                </div>
            </Drawer>

            <Dialog
                open={openConfirm}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleConfirmClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure do you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button onClick={handleLogout}>Yes, Logout</Button>
                </DialogActions>
            </Dialog>
            <ul className="company-logo">
                <li className="nav-item">
                    <a className="nav-link" href="#" role="button">
                        EZCARE
                        <span>ADMIN</span>
                    </a>
                </li>
            </ul>
            <ul className="secondary-nav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a href="#" className="nav-link notifications-btn" onClick={updateNotification}>
                            <svg width="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19.7695 11.6453C19.039 10.7923 18.7071 10.0531 18.7071 8.79716V8.37013C18.7071 6.73354 18.3304 5.67907 17.5115 4.62459C16.2493 2.98699 14.1244 2 12.0442 2H11.9558C9.91935 2 7.86106 2.94167 6.577 4.5128C5.71333 5.58842 5.29293 6.68822 5.29293 8.37013V8.79716C5.29293 10.0531 4.98284 10.7923 4.23049 11.6453C3.67691 12.2738 3.5 13.0815 3.5 13.9557C3.5 14.8309 3.78723 15.6598 4.36367 16.3336C5.11602 17.1413 6.17846 17.6569 7.26375 17.7466C8.83505 17.9258 10.4063 17.9933 12.0005 17.9933C13.5937 17.9933 15.165 17.8805 16.7372 17.7466C17.8215 17.6569 18.884 17.1413 19.6363 16.3336C20.2118 15.6598 20.5 14.8309 20.5 13.9557C20.5 13.0815 20.3231 12.2738 19.7695 11.6453Z"
                                    fill="currentColor"></path>
                                <path opacity="0.4"
                                    d="M14.0088 19.2283C13.5088 19.1215 10.4627 19.1215 9.96275 19.2283C9.53539 19.327 9.07324 19.5566 9.07324 20.0602C9.09809 20.5406 9.37935 20.9646 9.76895 21.2335L9.76795 21.2345C10.2718 21.6273 10.8632 21.877 11.4824 21.9667C11.8123 22.012 12.1482 22.01 12.4901 21.9667C13.1083 21.877 13.6997 21.6273 14.2036 21.2345L14.2026 21.2335C14.5922 20.9646 14.8734 20.5406 14.8983 20.0602C14.8983 19.5566 14.4361 19.327 14.0088 19.2283Z"
                                    fill="currentColor"></path>
                            </svg>
                            <CheckNoti />
                        </a>
                    </li>
                    <li className="nav-item">
                        <React.Fragment>
                            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                <Tooltip title="Account settings">
                                    <IconButton
                                        onClick={handleClick}
                                        size="small"
                                        sx={{ ml: 2 }}
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <Avatar sx={{ width: 42, height: 42 }}>A</Avatar>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Avatar /> Administrator
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <PersonIcon fontSize="small" />
                                    </ListItemIcon>
                                    My Profile
                                </MenuItem>
                                <MenuItem onClick={handleConfirmClickOpen}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </React.Fragment>
                    </li>
                </ul>
            </ul>
        </Wrapper.Header>
    )
}

const MainAside = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const HandleNavHome = () => {
        navigate('/ezcare-dashboard')
    }

    const HandleNavRequest = () => {
        navigate('/ezcare-request-ambulance')
    }

    const HandleNavFirstAid = () => {
        navigate('/ezcare-first-aider')
    }

    const HandleNavUser = () => {
        navigate('/ezcare-aid-seeker')
    }

    const HandleNavBugsReport = () => {
        navigate('/ezcare-bugs-report')
    }

    return (
        <Wrapper.Aside>
            <nav className="side-naviation">
                <ul className="navbar-side">
                    <li className={location.pathname === "/ezcare-dashboard" ? "navbar-side-item active-side-nav" : "navbar-side-item"}>
                        <Link onClick={HandleNavHome}>
                            <svg width="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9.14373 20.7821V17.7152C9.14372 16.9381 9.77567 16.3067 10.5584 16.3018H13.4326C14.2189 16.3018 14.8563 16.9346 14.8563 17.7152V20.7732C14.8562 21.4473 15.404 21.9951 16.0829 22H18.0438C18.9596 22.0023 19.8388 21.6428 20.4872 21.0007C21.1356 20.3586 21.5 19.4868 21.5 18.5775V9.86585C21.5 9.13139 21.1721 8.43471 20.6046 7.9635L13.943 2.67427C12.7785 1.74912 11.1154 1.77901 9.98539 2.74538L3.46701 7.9635C2.87274 8.42082 2.51755 9.11956 2.5 9.86585V18.5686C2.5 20.4637 4.04738 22 5.95617 22H7.87229C8.19917 22.0023 8.51349 21.8751 8.74547 21.6464C8.97746 21.4178 9.10793 21.1067 9.10792 20.7821H9.14373Z"
                                    fill="currentColor"></path>
                            </svg>
                        </Link>
                    </li>
                    <li className={location.pathname === "/ezcare-request-ambulance" ? "navbar-side-item active-side-nav" : "navbar-side-item"}>
                        <Link onClick={HandleNavRequest}>
                            <svg width="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.4"
                                    d="M11.7761 21.8374C9.49311 20.4273 7.37081 18.7645 5.44807 16.8796C4.09069 15.5338 3.05404 13.8905 2.41735 12.0753C1.27971 8.53523 2.60399 4.48948 6.30129 3.2884C8.2528 2.67553 10.3752 3.05175 12.0072 4.29983C13.6398 3.05315 15.7616 2.67705 17.7132 3.2884C21.4105 4.48948 22.7436 8.53523 21.606 12.0753C20.9745 13.8888 19.944 15.5319 18.5931 16.8796C16.6686 18.7625 14.5465 20.4251 12.265 21.8374L12.0161 22L11.7761 21.8374Z"
                                    fill="currentColor"></path>
                                <path
                                    d="M12.0109 22.0001L11.776 21.8375C9.49013 20.4275 7.36487 18.7648 5.43902 16.8797C4.0752 15.5357 3.03238 13.8923 2.39052 12.0754C1.26177 8.53532 2.58605 4.48957 6.28335 3.28849C8.23486 2.67562 10.3853 3.05213 12.0109 4.31067V22.0001Z"
                                    fill="currentColor"></path>
                                <path
                                    d="M18.2304 9.99922C18.0296 9.98629 17.8425 9.8859 17.7131 9.72157C17.5836 9.55723 17.5232 9.3434 17.5459 9.13016C17.5677 8.4278 17.168 7.78851 16.5517 7.53977C16.1609 7.43309 15.9243 7.00987 16.022 6.59249C16.1148 6.18182 16.4993 5.92647 16.8858 6.0189C16.9346 6.027 16.9816 6.04468 17.0244 6.07105C18.2601 6.54658 19.0601 7.82641 18.9965 9.22576C18.9944 9.43785 18.9117 9.63998 18.7673 9.78581C18.6229 9.93164 18.4291 10.0087 18.2304 9.99922Z"
                                    fill="currentColor"></path>
                            </svg>
                        </Link>
                    </li>
                    <li className={location.pathname === "/ezcare-first-aider" ? "navbar-side-item active-side-nav" : "navbar-side-item"}>
                        <Link onClick={HandleNavFirstAid}>
                            <svg width="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9.34933 14.8577C5.38553 14.8577 2 15.47 2 17.9173C2 20.3665 5.364 20.9999 9.34933 20.9999C13.3131 20.9999 16.6987 20.3876 16.6987 17.9403C16.6987 15.4911 13.3347 14.8577 9.34933 14.8577Z"
                                    fill="currentColor"></path>
                                <path opacity="0.4"
                                    d="M9.34935 12.5248C12.049 12.5248 14.2124 10.4062 14.2124 7.76241C14.2124 5.11865 12.049 3 9.34935 3C6.65072 3 4.48633 5.11865 4.48633 7.76241C4.48633 10.4062 6.65072 12.5248 9.34935 12.5248Z"
                                    fill="currentColor"></path>
                                <path opacity="0.4"
                                    d="M16.1733 7.84873C16.1733 9.19505 15.7604 10.4513 15.0363 11.4948C14.961 11.6021 15.0275 11.7468 15.1586 11.7698C15.3406 11.7995 15.5275 11.8177 15.7183 11.8216C17.6165 11.8704 19.3201 10.6736 19.7907 8.87116C20.4884 6.19674 18.4414 3.79541 15.8338 3.79541C15.551 3.79541 15.2799 3.82416 15.0157 3.87686C14.9795 3.88453 14.9404 3.90177 14.9208 3.93244C14.8954 3.97172 14.914 4.02251 14.9394 4.05605C15.7232 5.13214 16.1733 6.44205 16.1733 7.84873Z"
                                    fill="currentColor"></path>
                                <path
                                    d="M21.779 15.1693C21.4316 14.4439 20.593 13.9465 19.3171 13.7022C18.7153 13.5585 17.0852 13.3544 15.5695 13.3831C15.547 13.386 15.5343 13.4013 15.5324 13.4109C15.5294 13.4262 15.5363 13.4492 15.5656 13.4655C16.2662 13.8047 18.9737 15.2804 18.6332 18.3927C18.6185 18.5288 18.729 18.6438 18.867 18.6246C19.5333 18.5317 21.2476 18.1704 21.779 17.0474C22.0735 16.4533 22.0735 15.7634 21.779 15.1693Z"
                                    fill="currentColor"></path>
                            </svg>
                        </Link>
                    </li>
                    <li className={location.pathname === "/ezcare-aid-seeker" ? "navbar-side-item active-side-nav" : "navbar-side-item"}>
                        <Link onClick={HandleNavUser}>
                            <svg width="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.9488 14.54C8.49884 14.54 5.58789 15.1038 5.58789 17.2795C5.58789 19.4562 8.51765 20.0001 11.9488 20.0001C15.3988 20.0001 18.3098 19.4364 18.3098 17.2606C18.3098 15.084 15.38 14.54 11.9488 14.54Z"
                                    fill="currentColor"></path>
                                <path opacity="0.4"
                                    d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61293 4 7.73975 5.88306 7.73975 8.23351C7.73975 10.5831 9.61293 12.467 11.949 12.467Z"
                                    fill="currentColor"></path>
                                <path opacity="0.4"
                                    d="M21.0881 9.21923C21.6925 6.84176 19.9205 4.70654 17.664 4.70654C17.4187 4.70654 17.1841 4.73356 16.9549 4.77949C16.9244 4.78669 16.8904 4.802 16.8725 4.82902C16.8519 4.86324 16.8671 4.90917 16.8895 4.93889C17.5673 5.89528 17.9568 7.0597 17.9568 8.30967C17.9568 9.50741 17.5996 10.6241 16.9728 11.5508C16.9083 11.6462 16.9656 11.775 17.0793 11.7948C17.2369 11.8227 17.3981 11.8371 17.5629 11.8416C19.2059 11.8849 20.6807 10.8213 21.0881 9.21923Z"
                                    fill="currentColor"></path>
                                <path
                                    d="M22.8094 14.817C22.5086 14.1722 21.7824 13.73 20.6783 13.513C20.1572 13.3851 18.747 13.205 17.4352 13.2293C17.4155 13.232 17.4048 13.2455 17.403 13.2545C17.4003 13.2671 17.4057 13.2887 17.4316 13.3022C18.0378 13.6039 20.3811 14.916 20.0865 17.6834C20.074 17.8032 20.1698 17.9068 20.2888 17.8888C20.8655 17.8059 22.3492 17.4853 22.8094 16.4866C23.0637 15.9589 23.0637 15.3456 22.8094 14.817Z"
                                    fill="currentColor"></path>
                                <path opacity="0.4"
                                    d="M7.04459 4.77973C6.81626 4.7329 6.58077 4.70679 6.33543 4.70679C4.07901 4.70679 2.30701 6.84201 2.9123 9.21947C3.31882 10.8216 4.79355 11.8851 6.43661 11.8419C6.60136 11.8374 6.76343 11.8221 6.92013 11.7951C7.03384 11.7753 7.09115 11.6465 7.02668 11.551C6.3999 10.6234 6.04263 9.50765 6.04263 8.30991C6.04263 7.05904 6.43303 5.89462 7.11085 4.93913C7.13234 4.90941 7.14845 4.86348 7.12696 4.82926C7.10906 4.80135 7.07593 4.78694 7.04459 4.77973Z"
                                    fill="currentColor"></path>
                                <path
                                    d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.4851 3.13531 17.8066 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6832C3.61883 14.9167 5.9621 13.6046 6.56918 13.3029C6.59425 13.2885 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z"
                                    fill="currentColor"></path>
                            </svg>
                        </Link>
                    </li>
                    <li className={location.pathname === "/ezcare-bugs-report" ? "navbar-side-item active-side-nav" : "navbar-side-item"}>
                        <Link onClick={HandleNavBugsReport}>
                            <svg class="icon-32" width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.4" d="M4.72251 21.1672C4.70951 21.1672 4.69751 21.1672 4.68351 21.1662C4.36851 21.1502 4.05951 21.0822 3.76551 20.9632C2.31851 20.3752 1.62051 18.7222 2.20751 17.2762L9.52851 4.45025C9.78051 3.99425 10.1625 3.61225 10.6285 3.35425C11.9935 2.59825 13.7195 3.09525 14.4745 4.45925L21.7475 17.1872C21.9095 17.5682 21.9785 17.8782 21.9955 18.1942C22.0345 18.9502 21.7765 19.6752 21.2705 20.2362C20.7645 20.7972 20.0695 21.1282 19.3145 21.1662L4.79451 21.1672H4.72251Z" fill="currentColor"></path>                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1245 10.0208C11.1245 9.53875 11.5175 9.14575 11.9995 9.14575C12.4815 9.14575 12.8745 9.53875 12.8745 10.0208V12.8488C12.8745 13.3318 12.4815 13.7238 11.9995 13.7238C11.5175 13.7238 11.1245 13.3318 11.1245 12.8488V10.0208ZM11.1245 16.2699C11.1245 15.7849 11.5175 15.3899 11.9995 15.3899C12.4815 15.3899 12.8745 15.7799 12.8745 16.2589C12.8745 16.7519 12.4815 17.1449 11.9995 17.1449C11.5175 17.1449 11.1245 16.7519 11.1245 16.2699Z" fill="currentColor"></path>
                            </svg>
                        </Link>
                    </li>
                </ul>
            </nav>
        </Wrapper.Aside>
    )
}

const MainContentWrapper = (props) => {
    return (
        <Wrapper.ContentWrapper>
            {props.children}
        </Wrapper.ContentWrapper>
    )
}

const MainFooter = () => {
    return (
        <footer className="main-footer">

        </footer>
    )
}

export { MainHead, MainAside, MainContentWrapper, MainFooter }