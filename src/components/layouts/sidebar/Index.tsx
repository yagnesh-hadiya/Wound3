import React, { useMemo } from "react";
import { NavLink, matchPath, useLocation, useNavigate } from "react-router-dom";
import LogoRound from "../../../assets/main-logo.svg";
import { checkAclPermission } from "../../../helpers";

type SidebarProps = {
  isOpen: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const menuItems = [
    {
      text: "Dashboard",
      img: "grid_view",
      module: "Dashboard",
      path: "/",
    },
    {
      text: "Manage Staff",
      img: "person",
      module: "Manage Staff",
      path: "/manage-staff",
      subPaths: ["/staff/create", "/staff/edit/:id"],
    },
    {
      text: "Manage Facility Network",
      img: "medical_services",
      module: "Manage Facility Network",
      path: "/manage-facility-network",
      subPaths: ["/facility-network/create", "/facility-network/edit/:id"],
    },
    {
      text: "Manage Facilities",
      img: "medical_services",
      module: "Manage Facilities",
      path: "/manage-facilities",
      subPaths: ["/facility/create", "/facility/edit/:id"],
    },
    {
      text: "Manage Providers",
      img: "medical_information",
      module: "Manage Providers",
      path: "/manage-providers",
      subPaths: ["/provider/create", "/provider/edit/:id"],
    },
    {
      text: "Manage Patients",
      img: "badge",
      module: "Manage Patients",
      path: "/manage-patients",
      subPaths: [
        "/patient/create",
        "/patient/edit/:id",
        "/patient/:id/profile",
      ],
    },
    {
      text: "Settings",
      img: "manage_accounts",
      module: "Settings",
      path: "/settings",
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const isPathActive = (path: string, subPaths: string[] = []) => {
    if (location.pathname === path) return true;
    return subPaths.some((subPath) =>
      matchPath({ path: subPath, end: false }, location.pathname)
    );
  };
  
  const allowedMenus = useMemo(() => {
    return menuItems.filter((menu) =>
      checkAclPermission(menu.module, null, ["GET"])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="navbar-menu">
      <div
        className={`${isOpen ? "main-logo" : "main-logo-round"} cursor-pointer`}
        onClick={() => navigate(`/`)}
      >
        <img src={LogoRound} alt="logo" />
      </div>
      <ul className="navbar__list" style={{ paddingLeft: isOpen ? 18 : 18 }}>
        {allowedMenus?.map((item, i) => {
          const isActive = isPathActive(item.path, item.subPaths);
          return (
            <div className="navbar__li-box" key={i}>
              <NavLink
                to={item.path}
                className={`navbar__li-link ${isActive ? "active" : ""}`}
              >
                <>
                  <span
                    className={`material-symbols-outlined ${
                      isActive ? "fill" : ""
                    }`}
                  >
                    {item.img}
                  </span>
                  <li
                    className={`navbar__li ${
                      isOpen ? "inline-block" : "none"
                    } ${isActive ? "active" : ""}`}
                  >
                    {item.text}
                  </li>
                </>
              </NavLink>
            </div>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
