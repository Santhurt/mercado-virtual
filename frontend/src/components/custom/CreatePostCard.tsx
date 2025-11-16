import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

const CreatePostCard = () => (
    <Card>
        <CardContent className="pt-6">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        U
                    </AvatarFallback>
                </Avatar>
                <Input
                    placeholder="¿Qué quieres vender hoy?"
                    className="flex-1"
                />
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Publicar
                </Button>
            </div>
        </CardContent>
    </Card>
);

export default CreatePostCard;
