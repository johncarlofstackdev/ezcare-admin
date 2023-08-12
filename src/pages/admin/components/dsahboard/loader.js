import { CircularProgress } from "@mui/material";

const Loader = () => {
    return (
        <div className="loaadinger">
            <CircularProgress color="error" />
        </div>
    );
};

export default Loader