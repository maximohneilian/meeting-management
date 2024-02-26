import { BrowserRouter, Routes, Route} from "react-router-dom"
import ProtectedRoute from "./protectedRoute";
import LoginRoute from "./loginRoute";
import LoginPage from "../pages/loginPage";
import DashboardPage from "../pages/dashboardPage";
import MeetingDetailViewPage from "../pages/meetingDetailViewPage";
import UsersPage from "../pages/userPage";
import PdfExportPage from "../pages/pdfExportPage";
import CreateMinutesForm from "../pages/createMinutesForm";

export default function Router() {


  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginRoute/>}>
          <Route path="/login" element={<LoginPage/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path="" element={<DashboardPage/>}/>
          <Route path="/meeting/:meetingId" element={<MeetingDetailViewPage />}/>
          <Route path="/meeting/:meetingId/pdf" element={<PdfExportPage />} />
          <Route path="/meeting/:meetingId/createminutes" element={<CreateMinutesForm />} />
          <Route path="/user/:user_id" element={<UsersPage />} />
        </Route>
        <Route path="*" element={<>404 - Page not found.</>}/>
      </Routes>
    </BrowserRouter>
  );
}