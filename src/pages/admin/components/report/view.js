import EmptyView from "../firsaid/empty";

const View = (props) => {
    const { data } = props;

    if (!data) return <EmptyView />

    return (
        <div className="view-profile-area">
            <h1>Report Details</h1>
            <p className="reported-Details">{data.report}</p>
        </div >
    );
};

export default View;