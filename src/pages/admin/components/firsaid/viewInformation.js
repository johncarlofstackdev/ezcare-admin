import * as React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';

import * as FileSaver from 'file-saver';

import { db } from '../../../../config';
import FileFetcher from '../../../../components/fileFetcher';

import Unverified from "./unverified";
import Verfied from "./verfied";

import Loader from "./loaderView";
import Empty from "./empty";

const Information = ({ viewStatus, verify, activate, deactivate, snacbar, editInfo, editIfoState, cancelEdit, newDataState, onChangeInput, updateProfile }) => {
    const [data, dataSet] = React.useState({});

    React.useEffect(() => {
        const fetchData2 = async () => {
            try {
                const reference = "aid_provider/" + viewStatus.reference + "/";
                const rootRef = db.ref(reference);
                const snap = await rootRef.once("value");

                if (!snap.exists()) {
                    dataSet({});
                    return;
                }

                const informationUser = snap.val();
                const profile = !informationUser.profile ? "index.jpg" : informationUser.profile;
                const attachmentsSnap = await db.ref("attachments/" + viewStatus.reference + "/").once("value");
                informationUser["attachment"] = await FileFetcher("attachments/" + attachmentsSnap.val().attachment);
                informationUser["profile"] = await FileFetcher("profile/" + profile);
                dataSet(informationUser);

            } catch (error) {
                console.error("Error retrieving data:", error);
                dataSet({});
            }
        };

        fetchData2();
    }, [snacbar]);

    const donwloadFile = React.useCallback(() => {
        const file = data.attachment;
        FileSaver.saveAs(file);
    }, [data]);

    React.useEffect(() => {
        dataSet({});
        const fetchData = async () => {
            try {
                const reference = "aid_provider/" + viewStatus.reference + "/";
                const rootRef = db.ref(reference);
                const snap = await rootRef.once("value");

                if (!snap.exists()) {
                    dataSet({});
                    return;
                }

                const informationUser = snap.val();
                const profile = !informationUser.profile ? "index.jpg" : informationUser.profile;
                const attachmentsSnap = await db.ref("attachments/" + viewStatus.reference + "/").once("value");
                informationUser["attachment"] = await FileFetcher("attachments/" + attachmentsSnap.val().attachment);
                informationUser["profile"] = await FileFetcher("profile/" + profile);
                dataSet(informationUser);

            } catch (error) {
                console.error("Error retrieving data:", error);
                dataSet({});
            }
        };

        fetchData();
    }, [viewStatus]);


    return (!viewStatus.status ? <Empty /> : viewStatus.status && Object.keys(data).length === 0 ? <Loader /> : data.verified_status ? <Verfied data={data} download={donwloadFile} activate={activate} deactivate={deactivate} editInfo={editInfo} editIfoState={editIfoState} cancelEdit={cancelEdit} newDataState={newDataState} onChangeInput={onChangeInput} updateProfile={updateProfile} /> : <Unverified data={data} verify={verify} download={donwloadFile} />);
}

export default React.memo(Information);