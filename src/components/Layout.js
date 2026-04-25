import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { title: "إنشاء رحلة", path: "/create-trip", icon: "➕", roles: ["manager"] },
    { title: "تفقد الركاب", path: "/boarding-check", icon: "📋", roles: ["supervisor"] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="layout-container" dir="rtl">
      <aside className="sidebar glass-effect">
        <div className="sidebar-header">
          <h2 className="logo-text">نظام الباصات</h2>
        </div>
        <nav className="sidebar-nav">
          {filteredMenuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-title">{item.title}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header glass-effect">
          <h1 className="page-title">
            {menuItems.find((item) => item.path === location.pathname)?.title || "لوحة التحكم"}
          </h1>
          <div className="user-profile">
            <div className="user-avatar">👤</div>
            <span className="user-name">
              {user?.role === "manager" ? "المدير" : "المشرف"} ({user?.username})
            </span>
          </div>
        </header>
        <section className="page-container">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
