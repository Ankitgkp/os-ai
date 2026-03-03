"use client"

import { useState, FormEvent } from "react"
import { useAuth } from "@/context/AuthContext"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Tab = "signin" | "signup"

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [tab, setTab] = useState<Tab>("signin")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setUsername("")
    setEmail("")
    setPassword("")
    setError("")
  }

  const handleTabChange = (t: Tab) => {
    setTab(t)
    reset()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (tab === "signin") {
        await signIn(email, password)
      } else {
        await signUp(username, email, password)
      }
      reset()
      onOpenChange(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm border-border/50 bg-card/95 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Welcome</DialogTitle>
          <DialogDescription>
            {tab === "signin"
              ? "Sign in to save and access your chats."
              : "Create an account to keep your chats."}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex rounded-lg border border-border/50 bg-muted/30 p-1">
          {(["signin", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTabChange(t)}
              className={cn(
                "flex-1 rounded-md py-1.5 text-sm font-medium transition-all duration-200",
                tab === t
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "signup" && (
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              minLength={3}
              className="border-border/50 bg-muted/30 focus-visible:ring-primary/50"
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="border-border/50 bg-muted/30 focus-visible:ring-primary/50"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={tab === "signin" ? "current-password" : "new-password"}
            required
            minLength={8}
            className="border-border/50 bg-muted/30 focus-visible:ring-primary/50"
          />

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            disabled={loading}
          >
            {loading ? "Please wait..." : tab === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
