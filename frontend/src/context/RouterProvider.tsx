import FeedPage from "@/pages/FeedPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import MerchantDashboardPage from "@/pages/MerchantDashboardPage";
import CheckoutPage from "@/pages/CheckoutPage";
import MessagesPage from "@/pages/MessagesPage";
import AccountSettingsPage from "@/pages/AccountSettingsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { createBrowserRouter } from "react-router-dom";


const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />
    },
    {
        path: "/home",
        element: <FeedPage />,
    },
    {
        path: "/profile",
        element: <ProfilePage />,
    },
    {
        path: "/product/:id",
        element: <ProductDetailPage />
    },
    {
        path: "/dashboard",
        element: <MerchantDashboardPage />
    },
    {
        path: "/checkout",
        element: <CheckoutPage />
    },
    {
        path: "/messages",
        element: <MessagesPage />
    },
    {
        path: "/settings",
        element: <AccountSettingsPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;
