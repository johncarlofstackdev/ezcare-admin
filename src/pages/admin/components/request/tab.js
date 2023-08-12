const Tab = ({ type, active, AllRequest, label, count }) => (
    <div
      className={active === type.type ? "active" : ""}
      onClick={() => AllRequest(type.type, type.label)}
    >
      <label>{label}</label>
      <h2>{count}</h2>
    </div>
  );

  export default Tab;