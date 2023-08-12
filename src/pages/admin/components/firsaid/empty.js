

import empty from "../../../../img/empty.png";

const EmptyView = () => {
    return (
        <div className="empty-content">
            <div className="empty-container">
                <img src={empty.toString()} alt="Emtpy Image" />
                <h4>Request information will be displayed here</h4>
            </div>
        </div>
    );
}

export default EmptyView