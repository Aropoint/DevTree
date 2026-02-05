import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./Views/LoginView";
import RegisterView from "./Views/RegisterView";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import LinkTreeView from "./Views/LinkTreeView";
import ProfileView from "./Views/ProfileView";
import HandleView from "./Views/HandleView";
import NotFoundView from "./Views/NotFoundView";
import HomeView from "./Views/HomeView";

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

                <Route path="/:handle" element={<AuthLayout/>}>
                    <Route element={<HandleView/>} index={true} />
                    <Route path="profile" element={<ProfileView/>} />
                </Route>

                <Route path="/" element={<HomeView/>} />

                <Route path="/404" element={<AuthLayout/>}>
                    <Route element={<NotFoundView/>} index={true}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}