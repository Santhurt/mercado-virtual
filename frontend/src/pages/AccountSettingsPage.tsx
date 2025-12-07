import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Store, AlertTriangle, ChevronRight } from "lucide-react";
import { useState } from "react";

import ProfileInfoForm from "@/components/custom/settings/ProfileInfoForm";
import RoleUpgradeCard from "@/components/custom/settings/RoleUpgradeCard";
import DeleteAccountDialog from "@/components/custom/settings/DeleteAccountDialog";
import type { IUser } from "@/types/AppTypes";

// Mock user data - En producción vendría del contexto/API
const mockUser: IUser = {
    _id: "1",
    fullName: "Juan Pérez García",
    email: "juan.perez@email.com",
    documentNumber: "1234567890",
    age: 28,
    phone: "+57 312 456 7890",
    registrationDate: new Date("2024-03-15"),
    role: "customer",
    profileImage: null,
};

const AccountSettingsPage = () => {
    const [activeTab, setActiveTab] = useState("general");
    const [user, setUser] = useState<IUser>(mockUser);

    const handleSaveProfile = (updatedData: Partial<IUser>) => {
        setUser((prev) => ({ ...prev, ...updatedData }));
        // Aquí iría la llamada al API para guardar
        console.log("Profile saved:", updatedData);
    };

    const handleUpgradeRole = () => {
        setUser((prev) => ({ ...prev, role: "seller" }));
        // Aquí iría la llamada al API para upgrade
        console.log("Role upgraded to seller");
    };

    const handleDeleteAccount = () => {
        // Aquí iría la llamada al API para eliminar
        console.log("Account deleted");
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header con breadcrumb */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Perfil</span>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground">Configuración</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Configuración de Cuenta
                    </h1>
                    <p className="text-muted-foreground">
                        Administra tu información personal, rol de usuario y
                        preferencias de cuenta
                    </p>
                </div>

                {/* Tabs de contenido */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="general" className="gap-2">
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Información General
                            </span>
                            <span className="sm:hidden">General</span>
                        </TabsTrigger>
                        <TabsTrigger value="role" className="gap-2">
                            <Store className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Rol de Usuario
                            </span>
                            <span className="sm:hidden">Rol</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="danger"
                            className="gap-2 data-[state=active]:text-destructive"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Zona de Peligro
                            </span>
                            <span className="sm:hidden">Peligro</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="mt-6">
                        <ProfileInfoForm user={user} onSave={handleSaveProfile} />
                    </TabsContent>

                    <TabsContent value="role" className="mt-6">
                        <RoleUpgradeCard
                            currentRole={user.role}
                            onUpgrade={handleUpgradeRole}
                        />
                    </TabsContent>

                    <TabsContent value="danger" className="mt-6">
                        <DeleteAccountDialog onDelete={handleDeleteAccount} />
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
};

export default AccountSettingsPage;
