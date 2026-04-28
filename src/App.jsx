import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PageNotFound from "./lib/PageNotFound";
import AppShell from "@/components/layout/AppShell";

import Dashboard from "@/pages/Dashboard";
import CustodyCalendar from "@/pages/CustodyCalendar";
import Tasks from "@/pages/Tasks";
import Meals from "@/pages/Meals";
import Groceries from "@/pages/Groceries";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CustodyCalendar />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/groceries" element={<Groceries />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Toaster />
    </Router>
  );
}

export default App;
