import FeedPage from "@/pages/FeedPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import MerchantDashboardPage from "@/pages/MerchantDashboardPage";
import CheckoutPage from "@/pages/CheckoutPage";
import MessagesPage from "@/pages/MessagesPage";
import { createBrowserRouter } from "react-router-dom";


const router = createBrowserRouter([
    {
        path: "/",
        element: <FeedPage />,
    },
    {
        path: "/profile",
        element: <ProfilePage />,
    },
    {
        path: "/product",
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
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;
