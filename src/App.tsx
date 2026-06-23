import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/pages/Dashboard';
import SummariesList from '@/pages/SummariesList';
import SummaryDetail from '@/pages/SummaryDetail';
import Reminders from '@/pages/Reminders';
import Settings from '@/pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/summaries" element={<SummariesList />} />
        <Route path="/summaries/:id" element={<SummaryDetail />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}