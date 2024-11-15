import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./SellerSidebar.css";
import { toast } from "react-toastify";

const SellerSidebar = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const links = [
    { path: "/seller/catalogue", label: "Catalogue", icon: "category" },
    { path: "/seller/Orders", label: "Orders", icon: "shopping_cart" },
    { path: "/seller/Shop", label: "Shop", icon: "inventory_2" },
    { path: "/seller/reviews", label: "Reviews", icon: "analytics" },
    { path: "/seller/messages", label: "Messages", icon: "message" },
    { path: "/seller/users", label: "Complaints", icon: "report" },
  ];

  return (
    <aside className={`sidebar w-auto ${isOpen ? "open" : ""}`}>
      <div className="d-flex" style={{ flexDirection: "column" }}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-2">
          <div className="flex-1 flex justify-center">
            <h3 className="m-0 text-xl font-bold">{t("ReWear")}</h3>
          </div>
          <button className="bg-transparent hover:text-gray-400 p-0" onClick={toggleSidebar}>
            <span className="material-icons-outlined text-2xl font-bold">
              close
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav mt-3">
          <div
            onClick={() => navigate("/seller/Dashboard")}
            className="sidebar-link flex items-center cursor-pointer"
          >
            <span className="material-icons-outlined">dashboard</span>
            <span className="ml-3 text-base">{t("Dashboard")}</span>
          </div>

          {links.map((link) => (
            <div
              key={link.path}
              onClick={() => {
                if (user?.isVerified && user.status === "active") {
                  navigate(link.path);
                }
                else{
                  toast.warning('please verify your account or check your status');
                }
              }}
              className={`sidebar-link flex items-center ${
                user?.isVerified
                  ? "cursor-pointer"
                  : "cursor-not-allowed text-gray-500"
              }`}
              title={
                user?.isVerified ? "" : "Available for verified users only"
              }
            >
              <span className="material-icons-outlined">{link.icon}</span>
              <span className="ml-3 text-base">{t(link.label)}</span>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SellerSidebar;
