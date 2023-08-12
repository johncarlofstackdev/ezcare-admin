import { storage } from "../config";

const FileFetcher = async (fileRef) => {
    try {
        const url = await storage.ref().child(fileRef).getDownloadURL();
        return url;
    } catch (err) {
        console.log('Error getting download URL: ', err);
    }
}

export default FileFetcher