
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AlbumPage } from "./pages/SectionPage";
import { HomePage } from "./pages/HomePage";
import SectionsPage from "./pages/SectionsPage";
import { ROUTES } from "./Routes";
import ApplicationPage from "./pages/ApplicationPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter basename="/BMSTU-Sport-Frontend">
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.USER_DASHBOARD} element={<ProfilePage />} />
        <Route path={ROUTES.SECTIONS} element={<SectionsPage />} />
        <Route path={`${ROUTES.SECTIONS}/:id`} element={<AlbumPage />} />
        <Route path={ROUTES.APPLICATIONS} element={<ApplicationsPage />} />
        <Route path={`${ROUTES.APPLICATIONS}/:id`} element={<ApplicationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;