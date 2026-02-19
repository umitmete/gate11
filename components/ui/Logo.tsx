import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <div className={cn("flex flex-col items-end group select-none", className)}>
            <div className="relative flex items-baseline text-5xl font-black italic tracking-tighter leading-none font-sans">
                {/* GA Kısmı */}
                <span className="text-foreground">GA</span>

                {/* 1 Kısmı (Kırmızı ve Gölgeli) */}
                <span className="relative z-10 text-primary -mx-[0.05em] drop-shadow-[4px_0_5px_rgba(0,0,0,0.6)]">
                    1
                </span>

                {/* E Kısmı */}
                <span className="text-foreground overflow-visible">E</span>

                {/* Üstteki FAHRSCHULE Yazısı */}
                <div className="absolute -top-[5px] -right-[2px]">
                    <span className="text-[7px] font-bold tracking-[0.25em] text-foreground leading-none italic uppercase">
                        FAHRSCHULE
                    </span>
                </div>
            </div>
        </div>
    );
}
