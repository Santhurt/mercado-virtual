import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X } from "lucide-react";
import type { ICategory } from "@/types/AppTypes";

interface CategoryMultiSelectProps {
    categories: ICategory[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    placeholder?: string;
}

const CategoryMultiSelect = ({
    categories,
    selectedIds,
    onChange,
    placeholder = "Seleccionar categorías..."
}: CategoryMultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleCategory = (categoryId: string) => {
        if (selectedIds.includes(categoryId)) {
            onChange(selectedIds.filter(id => id !== categoryId));
        } else {
            onChange([...selectedIds, categoryId]);
        }
    };

    const removeCategory = (categoryId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selectedIds.filter(id => id !== categoryId));
    };

    const selectedCategories = categories.filter(cat => selectedIds.includes(cat._id));

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Trigger Button */}
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full justify-between h-auto min-h-[40px] py-2 px-3"
            >
                <div className="flex flex-wrap gap-1 flex-1 text-left">
                    {selectedCategories.length === 0 ? (
                        <span className="text-muted-foreground">{placeholder}</span>
                    ) : (
                        selectedCategories.map(cat => (
                            <Badge
                                key={cat._id}
                                variant="secondary"
                                className="flex items-center gap-1 px-2 py-0.5"
                            >
                                {cat.name}
                                <X
                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                    onClick={(e) => removeCategory(cat._id, e)}
                                />
                            </Badge>
                        ))
                    )}
                </div>
                <ChevronDown className={`h-4 w-4 shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95">
                    <div className="max-h-[200px] overflow-y-auto">
                        {categories.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No hay categorías disponibles
                            </div>
                        ) : (
                            categories.map(category => {
                                const isSelected = selectedIds.includes(category._id);
                                return (
                                    <div
                                        key={category._id}
                                        onClick={() => toggleCategory(category._id)}
                                        className={`
                                            flex items-center gap-2 px-3 py-2 rounded-sm cursor-pointer
                                            ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}
                                            transition-colors
                                        `}
                                    >
                                        <div className={`
                                            flex h-4 w-4 items-center justify-center rounded-sm border
                                            ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}
                                        `}>
                                            {isSelected && <Check className="h-3 w-3" />}
                                        </div>
                                        <span className="text-sm">{category.name}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryMultiSelect;
