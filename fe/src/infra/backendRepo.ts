export default class AuthApiClient {
  private base: string
  private token: string

  constructor(base: string, token: string) {
    this.base = base
    this.token = token
  }

  async getPrivateData() {
    return this.request('/api/private')
  }
  async getScopedAdmin() {
    return this.request('/api/private-scoped-admin')
  }
  private async request(path: string) {
    const r = await fetch(`${this.base}${path}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })
    if (!r.ok) throw new Error(`Backend error ${r.status}`)
    return r.json()
  }
}
