import FeedPage from "@/pages/FeedPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import SellerProfilePage from "@/pages/SellerProfilePage";
import MerchantDashboardPage from "@/pages/MerchantDashboardPage";
import CheckoutPage from "@/pages/CheckoutPage";
import MessagesPage from "@/pages/MessagesPage";
import AccountSettingsPage from "@/pages/AccountSettingsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import MyOrdersPage from "@/pages/MyOrdersPage";
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
        path: "/seller/:sellerId",
        element: <SellerProfilePage />,
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
        path: "/my-orders",
        element: <MyOrdersPage />
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;
