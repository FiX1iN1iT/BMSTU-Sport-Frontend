
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ROUTES } from "./Routes";

import HomePage from "./pages/HomePage";
import SectionPage from "./pages/SectionPage";
import SectionsPage from "./pages/SectionsPage";
import ApplicationPage from "./pages/ApplicationPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import SectionsTablePage from "./pages/SectionsTablePage";
import SectionEditPage from "./pages/SectionEditPage";

function App() {
  return (
    <BrowserRouter basename="/BMSTU-Sport-Frontend">
      <Routes>
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />

        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.USER_DASHBOARD} element={<ProfilePage />} />
        <Route path={ROUTES.SECTIONS} element={<SectionsPage />} />
        <Route path={`${ROUTES.SECTIONS}/:id`} element={<SectionPage />} />
        <Route path={ROUTES.APPLICATIONS} element={<ApplicationsPage />} />
        <Route path={`${ROUTES.APPLICATIONS}/:id`} element={<ApplicationPage />} />

        <Route path={ROUTES.SECTIONSTABLE} element={<SectionsTablePage />} />
        <Route path={`${ROUTES.SECTIONSTABLE}/:id`} element={<SectionEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;