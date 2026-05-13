"use client"

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 px-6 py-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border text-xs font-semibold shadow-sm">
        AI
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-card/60 border border-border/40 px-4 py-3 shadow-sm backdrop-blur-sm">
        <span
          className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  )
}
