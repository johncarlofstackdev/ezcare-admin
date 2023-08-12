import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const Empty = () => {
    return (
        <div className="no-result-found no-found-result2">
            <div className="sad-face">
                <SentimentDissatisfiedIcon color="error" sx={{ fontSize: 90 }} />
            </div>
            <div className="message-no-result-msg">
                Sorry, no records found was your trying to find.
            </div>
        </div>
    );
};

export default Empty