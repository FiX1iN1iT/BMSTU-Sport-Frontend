
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AlbumPage } from "./pages/SectionPage";
import { HomePage } from "./pages/HomePage";
import SectionsPage from "./pages/SectionsPage";
import { ROUTES } from "./Routes";
import ApplicationPage from "./pages/ApplicationPage";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";

function App() {
    useEffect(()=>{
        invoke('tauri', {cmd:'create'})
          .then(() =>{console.log("Tauri launched")})
          .catch(() =>{console.log("Tauri not launched")})
        return () =>{
          invoke('tauri', {cmd:'close'})
            .then(() =>{console.log("Tauri launched")})
            .catch(() =>{console.log("Tauri not launched")})
        }
      }, [])

  return (
    <BrowserRouter basename="/BMSTU-Sport-Frontend">
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.SECTIONS} element={<SectionsPage />} />
        <Route path={`${ROUTES.SECTIONS}/:id`} element={<AlbumPage />} />
        <Route path={`${ROUTES.APPLICATIONS}/:id`} element={<ApplicationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;