import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LuxuryCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function LuxuryCard({ children, className, hoverEffect = true }: LuxuryCardProps) {
    return (
        <div className={cn(
            "bg-card/30 backdrop-blur-sm border border-primary/10 p-6 relative overflow-hidden group transition-all duration-700",
            hoverEffect && "hover:border-primary/50 hover:shadow-[0_0_50px_-12px_rgba(229,4,18,0.3)] hover:-translate-y-1",
            className
        )}>
            {/* Subtle Red Gradient Overlay on Hover */}
            {hoverEffect && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            )}

            <div className="relative z-10 h-full flex flex-col">
                {children}
            </div>
        </div>
    );
}

export function CardTitle({ children, className }: { children: ReactNode, className?: string }) {
    return <h3 className={cn("text-xl font-serif text-foreground mb-2 italic pr-2", className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: ReactNode, className?: string }) {
    return <p className={cn("text-muted-foreground text-sm leading-relaxed font-light", className)}>{children}</p>;
}
