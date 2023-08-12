import React, { useState, useEffect } from "react";
import { db } from "../config";

const CheckedNoti = () => {
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const ambulanceRef = db.ref("ambulance/");
        ambulanceRef.on("value", snapshot => {
            if (!snapshot.exists()) {
                setShowNotification(false);
                return;
            }

            const response = snapshot.val();
            const unreadNotifications = Object.values(response).filter(
                (notification) => !notification.admin_read
            );

            setShowNotification(unreadNotifications.length === 0 ? false : true);
        });

        return () => ambulanceRef.off("value");
    }, []);

    return (showNotification ? <span className="badge-notificatio"></span> : null);
};

export default React.memo(CheckedNoti);