import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Layout from "./components/layout/Layout";
import About from "./pages/about/About";
import Events from "./pages/events/Events";
// import Leadership from "./pages/leadership/Leadership";
import PendingApproval from "./pages/pending-approval/PendingApproval";
import NotFound from "./pages/not-found/NotFound";
import MembersPage from "./pages/members-page/MembersPage";
import MemberDetailPage from "./pages/member-detail-page/MemberDetailPage";
import News from "./pages/news/News";
import NewsDetail from "./pages/news-detail/NewsDetail";
import Gallery from "./pages/gallery/Gallery";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import VerifyEmail from "./pages/register/VerifyEmail";
import Profile from "./pages/profile/Profile";
import Mentorship from "./pages/mentorship/Mentorship";
import Directory from "./pages/directory/Directory";
import Jobs from "./pages/jobs/Jobs";
import BusinessDirectory from "./pages/business-directory/BusinessDirectory";
import BusinessDetail from "./pages/business-detail/BusinessDetail";
import ProtectedRoute from "./components/protected-route/ProtectedRoute";
import Leadership from "./pages/leadership/Leadership";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Standalone pages — no Navbar/Footer */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/pending-approval" element={<PendingApproval />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        {/* <Route path="/leadership" element={<Leadership />} /> */}
        <Route path="/leadership" element={<MembersPage />} />

        {/* Single member detail */}
        <Route path="/leadership/:id" element={<MemberDetailPage />} />

        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/gallery" element={<Gallery />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/leaderships" element={<Leadership />} />
        <Route path="/business-directory" element={<BusinessDirectory />} />
        <Route path="/business-directory/:id" element={<BusinessDetail />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
