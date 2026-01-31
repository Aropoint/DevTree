import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./Views/LoginView";
import RegisterView from "./Views/RegisterView";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import LinkTreeView from "./Views/LinkTreeView";
import ProfileView from "./Views/ProfileView";

export default function Router() {

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayout/>}>
                    <Route path="/auth/login" element={<LoginView/>} />
                    <Route path="/auth/register" element={<RegisterView/>} />
                </Route>

                <Route path="/admin" element={<AppLayout/>}>
                    <Route index={true} element={<LinkTreeView/>} />
                    <Route path="profile" element={<ProfileView/>} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}