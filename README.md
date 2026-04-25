# 🚌 Bus Passenger Check System | نظام تفقد ركاب الحافلات

[Arabic Description Below]

A premium, modern, and responsive web application designed for bus trip management. This system provides a seamless experience for managers to create trips, supervisors to check passengers using a high-fidelity interactive seat map, and drivers to receive real-time departure signals.

---

## 🌟 Features | المميزات

### 🔑 Role-Based Access Control
- **Manager:** Create and configure trips, select bus layouts, and assign supervisors.
- **Supervisor:** Conduct real-time boarding checks using an interactive glassmorphism UI.
- **Driver:** View live boarding progress and receive visual "Ready to Depart" signals.

### 🗺️ Interactive Bus Map
- High-fidelity seat visualization (Supports multiple layouts: 2+1, 2+2, etc.).
- Intuitive gender-based seat selection.
- One-tap check-in system for supervisors.

### ⚡ Real-Time Sync (Simulated)
- Utilizes `localStorage` events to synchronize data between the Supervisor and Driver screens instantly without needing a backend server (ideal for demonstration and local usage).

### 🎨 Premium UI/UX
- **Glassmorphism Design:** Modern, sleek interface with blur effects and vibrant gradients.
- **Fully Responsive:** Optimized for mobile, tablet, and desktop.
- **Traffic Light System:** Visual indicators for drivers (Red for waiting, Green for departure).

---

## 🛠️ Tech Stack | التقنيات المستخدمة

- **Frontend:** React.js (v19+)
- **Routing:** React Router v7
- **State Management:** Context API & React Hooks
- **Styling:** Vanilla CSS (Modern CSS Variables & Glassmorphism)
- **Deployment Ready:** Optimized for hosting platforms like Hostinger, Vercel, or GitHub Pages.

---

## 🚀 Getting Started | البدء بالعمل

### 1. Clone the repository
```bash
git clone https://github.com/abdolah-17/bus-check-system.git
cd bus-check-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the application
```bash
npm start
```
The app will be available at `http://localhost:3000`.

---

## 📸 Project Structure | هيكل المشروع

- `/src/components`: Reusable UI components (Seat, SeatGrid, ProtectedRoute, etc.).
- `/src/pages`: Main application views (Login, CreateTrip, BoardingCheck, DriverDashboard).
- `/src/styles`: Modular CSS files following a consistent design system.
- `/src/context`: Authentication and global state logic.

---

## 🇸🇦 وصف المشروع بالعربية

نظام احترافي وعصري لإدارة تفقد ركاب الحافلات، يتميز بتصميم زجاجي (Glassmorphism) جذاب وتجربة مستخدم سلسة.

**أهم الوظائف:**
- **لوحة المدير:** إنشاء الرحلات وتحديد توزيع المقاعد وتعيين المشرفين.
- **لوحة المشرف:** تفقد الركاب من خلال خريطة تفاعلية ذكية للباص، مع إمكانية تحديد الجنس وتتبع حالة الصعود.
- **شاشة السائق:** شاشة مخصصة تعرض حالة الباص الحالية، عدد الركاب المتبقيين، وإشارة "انطلق" باللون الأخضر فور اكتمال العدد.
- **المزامنة اللحظية:** ربط حي بين شاشة المشرف والسائق لمتابعة التقدم لحظة بلحظة.

---

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License
This project is licensed under the MIT License.
