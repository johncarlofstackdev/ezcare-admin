

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"

// Imported Pages
import Login from "../pages/login"
// admin pages

import Dashboard from "../pages/admin/dashboard"
import Firstaid from "../pages/admin/firstaid"
import Request from "../pages/admin/request"
import User from "../pages/admin/user"
import Report from "../pages/admin/report"

import { Error404 } from "../pages/error"

// firebase config
import { auth } from "../config"

const Index = () => {
    const [initializing, setinitializing] = useState(false)
    const [user, setUser] = useState()

    // Handle user state changes
    const onAuthStateChanged = (user) => {
        setUser(user)
        if (initializing) setinitializing(false)
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged)
        return subscriber
    }, [])

    if (initializing) return null

    if (!user) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route index element={<Login />} />
                    <Route exact path="/" element={<Login />} />
                </Routes>
            </BrowserRouter>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="ezcare-dashboard" element={<Dashboard />} />
                <Route path="ezcare-first-aider" element={<Firstaid />} />
                <Route path="ezcare-request-ambulance" element={<Request />} />
                <Route path="ezcare-aid-seeker" element={<User />} />
                <Route path="ezcare-bugs-report" element={<Report />} />
                <Route path="*" element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Index