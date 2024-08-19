import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="w-[100vw] mx-auto h-[100vh]">
      <Outlet></Outlet>
    </div>
  );
};

export default Main;
