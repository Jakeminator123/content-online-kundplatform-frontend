// Opaque sessions for the local demo only. No credentials are embedded in the browser.
export class OperatorSessions {
  private readonly sessions = new Map<string, number>()
  constructor(private readonly now: () => number = Date.now) {}

  create() {
    for (const [token, expires] of this.sessions) {
      if (expires <= this.now()) this.sessions.delete(token)
    }
    if (this.sessions.size >= 1000) throw new Error('Too many demo sessions')
    const token = crypto.randomUUID()
    this.sessions.set(token, this.now() + 8 * 60 * 60 * 1000)
    return token
  }

  verify(token: string | undefined) {
    if (!token) return false
    const expires = this.sessions.get(token)
    if (!expires || expires <= this.now()) {
      this.sessions.delete(token)
      return false
    }
    return true
  }

  delete(token: string | undefined) {
    if (token) this.sessions.delete(token)
  }
}
