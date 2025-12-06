import React, { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import Preloader from "../ui/preloader";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [activeItem, setActiveItem] = useState("home");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 250);
        return () => clearTimeout(timeout);
    });

    if (loading) return <Preloader />

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                />

                <SidebarInset className="flex-1 flex flex-col">
                    {/* Header */}
                    <AppHeader />

                    {/* Main Content */}
                    <div className="flex-1 overflow-auto p-4 md:p-6">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Main Feed */}
                                <main className="lg:col-span-12 space-y-6">
                                    {children}
                                </main>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;
