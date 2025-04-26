import Dashboard from "./Dashboard";
import ManagerHome from "./ManagerHome";

const Home = ({ managerId }) => {
  if (managerId === "1") {
    return <ManagerHome />;
  }
  return <Dashboard />;
};

export default Home;
