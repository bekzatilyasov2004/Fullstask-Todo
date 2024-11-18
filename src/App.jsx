import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./dashboard/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import TodayChallenges from "./dashboard/TodayChallenges";
import WeeklyTasks from "./dashboard/WeeklyTasks";
import MonthlyTasks from "./dashboard/MonthlyTasks";
import PrivateRoute from "./private/PrivateRoute";
import SpecialDayPage from "./pages/SpecialDayPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="login" element={<LoginPage />} />

      <Route
        path="dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route path="today" element={<TodayChallenges />} />
        <Route path="weekly" element={<WeeklyTasks />} />
        <Route path="monthly" element={<MonthlyTasks />} />
        <Route path="special/:specialName" element={<SpecialDayPage />} />
        <Route index element={<TodayChallenges />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
