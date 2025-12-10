import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Store, AlertTriangle, ChevronRight } from "lucide-react";
import { useState } from "react";

import ProfileInfoForm from "@/components/custom/settings/ProfileInfoForm";
import RoleUpgradeCard from "@/components/custom/settings/RoleUpgradeCard";
import DeleteAccountDialog from "@/components/custom/settings/DeleteAccountDialog";
import { useAuthContext } from "@/context/AuthContext";
import { useUpdateUser } from "@/hooks/useRole";
import type { IUser } from "@/types/AppTypes";

const AccountSettingsPage = () => {
    const [activeTab, setActiveTab] = useState("general");
    const { user, isLoading } = useAuthContext();
    const updateUserMutation = useUpdateUser();

    const handleSaveProfile = async (updatedData: Partial<IUser>) => {
        try {
            await updateUserMutation.mutateAsync({
                fullName: updatedData.fullName,
                email: updatedData.email,
                documentNumber: updatedData.documentNumber,
                age: updatedData.age,
                phone: updatedData.phone,
            });
        } catch (error) {
            console.error("Error saving profile:", error);
            throw error; // Re-throw to let the form handle it
        }
    };

    const handleDeleteAccount = () => {
        // Aquí iría la llamada al API para eliminar
        console.log("Account deleted");
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </MainLayout>
        );
    }

    if (!user) {
        return (
            <MainLayout>
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        Debes iniciar sesión para acceder a la configuración.
                    </p>
                </div>
            </MainLayout>
        );
    }

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
                        <RoleUpgradeCard currentRole={user.role} />
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
