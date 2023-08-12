import * as React from "react";
import EZcareLogo from "../img/EZCARE-LOGO.png";
import AlertSound from "../img/alertsounds/alert.mp3";

import { db } from "../config";

const AmbulanceNotification = () => {
    const handleChildAdded = React.useCallback(async (snapshot) => {
        if ("Notification" in window) {
            if (snapshot.exists() && window.Notification?.permission === "granted") {
                const newlyData = snapshot.val();
                const referenceKey = snapshot.key;

                if (newlyData.NewlyAddedCheck) {

                    const userRef = db.ref("aid_provider/" + newlyData.provider_id + "/");
                    const userRoof = await userRef.once("value");
                    const response = userRoof.val();

                    const notification = new Notification("AMBULANCE REQUEST", {
                        body: `${response.fullname} just requested an ambulance`,
                        icon: EZcareLogo,
                    });

                    const audio = new Audio(AlertSound);
                    await audio.play();

                    setTimeout(async () => {
                        try {
                            await db.ref("ambulance/" + referenceKey + "/").update({ NewlyAddedCheck: false });
                        } catch (error) {
                            console.log("error update notification");
                        }
                    }, 1000);
                }
            }
        }
    }, []);

    React.useEffect(() => {
        const ref = db.ref("ambulance/");
        ref.on("child_added", handleChildAdded);
        return () => ref.off("child_added", handleChildAdded);
    }, [handleChildAdded]);

    return null;
};


export default React.memo(AmbulanceNotification);