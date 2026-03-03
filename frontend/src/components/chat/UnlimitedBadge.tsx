"use client";

export function UnlimitedBadge() {
  return (
    <div className="flex items-center gap-2 animate-fade-in-up">
      <span className="text-xl leading-none text-primary drop-shadow-[0_0_8px_rgba(212,160,74,0.3)]">
        ∞
      </span>
      <div className="flex flex-col leading-none gap-0.5">
        <span className="text-[10px] font-bold tracking-[3px] uppercase text-primary/80">
          Free
        </span>
      </div>
    </div>
  );
}
