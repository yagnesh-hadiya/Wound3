import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState, useEffect } from "react";
import Sidebar from "./sidebar/Index";

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.remove("sidebar-open");
    } else {
      document.body.classList.add("sidebar-open");
    }
  }, [isSidebarOpen]);

  return (
    <div className="layout">
      <Header isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="layout-body">
        <Sidebar isOpen={isSidebarOpen} />
        <div
          className="content"
          style={{
            paddingLeft: isSidebarOpen ? 301 : 100,
            paddingRight: "20px",
            paddingTop: "65px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
