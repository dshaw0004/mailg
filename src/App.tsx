import { Routes, Route, Navigate } from 'react-router-dom';
import { MailProvider } from './context/MailContext';
import Layout from './components/Layout';
import Mailbox from './pages/Mailbox';
import MailDetail from './pages/MailDetail';
import Settings from './pages/Settings';

export default function App() {
  return (
    <MailProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/inbox" replace />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/:folder" element={<Mailbox />} />
          <Route path="/mail/:id" element={<MailDetail />} />
        </Routes>
      </Layout>
    </MailProvider>
  );
}
