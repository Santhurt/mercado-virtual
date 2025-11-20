
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Image, Bold, Italic, Link, Smile, Plus } from "lucide-react";

const CreatePostCard = () => {
    const [content, setContent] = useState("");

    const toolbarButtons = [
        { icon: Image, label: "Subir imagen", action: () => {} },
        { icon: Bold, label: "Negrita", action: () => {} },
        { icon: Italic, label: "Cursiva", action: () => {} },
        { icon: Link, label: "Añadir enlace", action: () => {} },
        { icon: Smile, label: "Emoji", action: () => {} },
    ];

    return (
        <Card className="shadow-sm transition-all hover:shadow-md">
            <CardContent className="pt-3">
                {/* Top: avatar + textarea */}
                <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            U
                        </AvatarFallback>
                    </Avatar>

                    <textarea
                        placeholder="¿Qué quieres vender hoy?"
                        className="w-full min-h-[90px] p-3 text-sm rounded-md bg-muted/20 border border-transparent focus:border-primary/50 focus:ring-2 focus:ring-primary/40 outline-none transition-all resize-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <Separator className="my-3" />

                {/* Bottom row: toolbar + submit */}
                <div className="flex items-center justify-between">
                    <TooltipProvider delayDuration={200}>
                        <div className="flex items-center gap-2">
                            {toolbarButtons.map((btn, i) => (
                                <Tooltip key={i}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 hover:bg-accent transition-colors"
                                            onClick={btn.action}
                                        >
                                            <btn.icon className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <p className="text-xs">{btn.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </TooltipProvider>

                    <Button
                        className="gap-2 font-semibold"
                        disabled={!content.trim()}
                    >
                        <Plus className="h-4 w-4" />
                        Publicar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CreatePostCard;
