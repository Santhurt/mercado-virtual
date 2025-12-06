import FeedPage from "@/pages/FeedPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ProfilePage from "@/pages/ProfilePage";
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
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;
