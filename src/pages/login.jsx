
import { useState, useEffect } from "react"

import {
    Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox,
    Grid, Box, Typography, Container, createTheme, ThemeProvider,
    CircularProgress
} from "@mui/material"

import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom"

// firebase config
import { auth } from "../config"

const Login = () => {
    const navigate = useNavigate()

    const HandlerEvent = async (event) => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
            const userCredentials = await auth.signInWithEmailAndPassword(email.value, password.value);
            navigate('ezcare-dashboard');
        } catch (error) {
            alert(error)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    </Avatar>
                    <Box component="form" onSubmit={HandlerEvent} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="off"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="error" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            id="submit"
                            color="error"
                            sx={{ mt: 3, mb: 2, pt: 1.5, pb: 1.5 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/permalink-login" className="css-v811nf">Forgot password?</Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}

const theme = createTheme();

const Copyright = (props) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <a color="error" href="https://mui.com/" >
                EZCARE
            </a>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Login