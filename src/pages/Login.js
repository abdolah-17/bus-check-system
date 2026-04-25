import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState("manager");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    // Custom Validation
    let isValid = true;
    setUsernameError("");
    setPasswordError("");
    setErrorMessage("");

    if (!username.trim()) {
      setUsernameError("اسم المستخدم مطلوب");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("كلمة المرور مطلوبة");
      isValid = false;
    }

    if (!isValid) return;

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    const foundUser = users.find(
      (user) =>
        user.username.toLowerCase() === cleanUsername &&
        user.password === cleanPassword &&
        user.role === selectedRole
    );

    if (!foundUser) {
      setErrorMessage("بيانات الدخول غير صحيحة، تأكد من اسم المستخدم وكلمة المرور");
      return;
    }

    setErrorMessage("");
    login(foundUser); // Save user to context and local

    if (foundUser.role === "manager") {
      navigate("/create-trip");
    } else if (foundUser.role === "supervisor") {
      const savedTrip = localStorage.getItem("tripData");

      if (!savedTrip) {
        setErrorMessage("لا توجد رحلة محفوظة للمشرف حاليًا. يجب على المدير إنشاء رحلة أولاً.");
        return;
      }

      navigate("/boarding-check", {
        state: JSON.parse(savedTrip),
      });
    } else if (foundUser.role === "driver") {
      navigate("/driver-dashboard");
    }
  };

  return (
    <div className="page-container login-page" dir="rtl">
      <div className="glass-card login-card">
        <h1 className="login-title">تسجيل الدخول</h1>
        <p className="login-subtitle">أهلاً بك في نظام إدارة الباصات</p>

        <div className="role-switch">
          <button
            type="button"
            className={`role-btn ${selectedRole === "manager" ? "active-role" : ""}`}
            onClick={() => { setSelectedRole("manager"); setErrorMessage(""); }}
          >
            المدير
          </button>

          <button
            type="button"
            className={`role-btn ${selectedRole === "supervisor" ? "active-role" : ""}`}
            onClick={() => { setSelectedRole("supervisor"); setErrorMessage(""); }}
          >
            المشرف
          </button>

          <button
            type="button"
            className={`role-btn ${selectedRole === "driver" ? "active-role" : ""}`}
            onClick={() => { setSelectedRole("driver"); setErrorMessage(""); }}
          >
            السائق
          </button>
        </div>

        <form className="login-form" onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label className="form-label">اسم المستخدم</label>
            <input
              className="form-input"
              type="text"
              value={username}
              onChange={(event) => { setUsername(event.target.value); setUsernameError(""); }}
              placeholder="أدخل اسم المستخدم"
              style={{ borderColor: usernameError ? "#ef4444" : "" }}
            />
            {usernameError && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "5px" }}>{usernameError}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(event) => { setPassword(event.target.value); setPasswordError(""); }}
              placeholder="أدخل كلمة المرور"
              style={{ borderColor: passwordError ? "#ef4444" : "" }}
            />
            {passwordError && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "5px" }}>{passwordError}</span>}
          </div>

          {errorMessage && <p className="login-error">{errorMessage}</p>}

          <button className="btn btn-primary" type="submit">
            دخول للنظام
          </button>
        </form>

        <div className="login-help">
          <p>بيانات التجربة:</p>
          <p>المدير: <span>admin / 1234</span></p>
          <p>المشرف: <span>supervisor / 1234</span></p>
          <p>السائق: <span>driver / 1234</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;