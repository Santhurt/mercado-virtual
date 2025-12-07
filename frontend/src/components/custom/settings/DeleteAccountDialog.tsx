import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Trash2, ShieldAlert } from "lucide-react";

type DeleteAccountDialogProps = {
    onDelete?: () => void;
};

const DeleteAccountDialog = ({ onDelete }: DeleteAccountDialogProps) => {
    const [confirmText, setConfirmText] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const isConfirmValid = confirmText === "ELIMINAR";

    const handleDelete = () => {
        if (isConfirmValid) {
            onDelete?.();
            setIsOpen(false);
            setConfirmText("");
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setConfirmText("");
        }
    };

    return (
        <Card className="w-full border-destructive/30 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-destructive/10">
                        <ShieldAlert className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                        <CardTitle className="text-destructive">
                            Zona de Peligro
                        </CardTitle>
                        <CardDescription>
                            Acciones irreversibles de tu cuenta
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border border-destructive/20 bg-white/50 dark:bg-black/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-medium text-destructive">
                                Eliminar cuenta
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Esta acción eliminará permanentemente tu cuenta
                                y todos los datos asociados.
                            </p>
                        </div>
                        <AlertDialog
                            open={isOpen}
                            onOpenChange={handleOpenChange}
                        >
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2 shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Eliminar cuenta
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md">
                                <AlertDialogHeader>
                                    <div className="mx-auto mb-4 p-4 rounded-full bg-destructive/10">
                                        <AlertTriangle className="h-8 w-8 text-destructive" />
                                    </div>
                                    <AlertDialogTitle className="text-center">
                                        ¿Eliminar tu cuenta?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-center space-y-2">
                                        <p>
                                            Esta acción es{" "}
                                            <strong>permanente e irreversible</strong>.
                                            Se eliminarán:
                                        </p>
                                        <ul className="text-left list-disc list-inside mt-2 space-y-1 text-sm">
                                            <li>Tu perfil y datos personales</li>
                                            <li>Historial de compras y ventas</li>
                                            <li>Productos publicados</li>
                                            <li>Mensajes y conversaciones</li>
                                        </ul>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <div className="my-4 space-y-2">
                                    <Label htmlFor="confirm-delete">
                                        Escribe{" "}
                                        <span className="font-mono font-bold text-destructive">
                                            ELIMINAR
                                        </span>{" "}
                                        para confirmar
                                    </Label>
                                    <Input
                                        id="confirm-delete"
                                        value={confirmText}
                                        onChange={(e) =>
                                            setConfirmText(e.target.value)
                                        }
                                        placeholder="Escribe ELIMINAR"
                                        className="font-mono"
                                    />
                                </div>

                                <AlertDialogFooter className="sm:flex-col-reverse sm:space-x-0 gap-2">
                                    <AlertDialogCancel className="sm:w-full">
                                        Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={!isConfirmValid}
                                        className="sm:w-full bg-destructive hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Eliminar mi cuenta permanentemente
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground">
                    Si tienes problemas con tu cuenta, considera{" "}
                    <a href="#" className="text-primary hover:underline">
                        contactar soporte
                    </a>{" "}
                    antes de eliminarla.
                </p>
            </CardContent>
        </Card>
    );
};

export default DeleteAccountDialog;
