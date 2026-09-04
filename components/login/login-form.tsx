'use client'

import { useActionState, useState } from 'react'
import { ArrowRight, Loader2, ShieldCheck, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction, type LoginState } from '@/app/login/actions'

const DEMO_ACCOUNTS = [
  { username: 'Bibbi', password: 'Mallorca123', role: 'Personal', icon: User },
  { username: 'Hampus', password: 'Mallorca123', role: 'Admin', icon: ShieldCheck },
]

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, undefined)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form action={action} className="flex flex-col gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Användarnamn</Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="h-11 bg-card"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Lösenord</Label>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
            Glömt lösenord?
          </a>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 bg-card"
        />
      </div>

      {state?.error ? (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="h-11 justify-between px-4">
        <span>Logga in</span>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
      </Button>

      <fieldset className="flex flex-col gap-2 rounded-lg border border-dashed p-3">
        <legend className="px-1 text-xs font-medium text-muted-foreground">Demokonton</legend>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.username}
              type="button"
              onClick={() => {
                setUsername(acc.username)
                setPassword(acc.password)
              }}
              className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-left text-sm transition-colors hover:border-primary hover:bg-accent"
            >
              <acc.icon className="size-4 shrink-0 text-primary" />
              <span className="flex flex-col leading-tight">
                <span className="font-medium">{acc.username}</span>
                <span className="text-xs text-muted-foreground">{acc.role}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Lösenord för båda: <span className="font-mono">Mallorca123</span>
        </p>
      </fieldset>
    </form>
  )
}
