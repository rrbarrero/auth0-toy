class AuthApiClient {
  private apiUrl: string
  private userToken: string

  constructor(baseUrl: string, token: string) {
    this.apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    this.userToken = token
  }

  public async getPrivateData(): Promise<unknown> {
    const endpoint = `${this.apiUrl}/api/private`

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.userToken}`,
        },
      })

      if (!response.ok) {
        let errorMessage = `Http error: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          if (errorData.detail) {
            errorMessage = `Api error: ${errorData.detail} (status: ${response.status})`
          } else {
            errorMessage = `Api error: ${JSON.stringify(errorData)} (status: ${response.status})`
          }
        } catch (jsonError) {
          console.error('Error couldnt be parsed:', jsonError)
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error al obtener datos privados:', error)
      throw error //
    }
  }

  public async getScopedAdmin(): Promise<unknown> {
    const endpoint = `${this.apiUrl}/api/private-scoped-admin`

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.userToken}`,
        },
      })

      if (!response.ok) {
        let errorMessage = `Http error: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          if (errorData.detail) {
            errorMessage = `Api error: ${errorData.detail} (status: ${response.status})`
          } else {
            errorMessage = `Api error: ${JSON.stringify(errorData)} (status: ${response.status})`
          }
        } catch (jsonError) {
          console.error('Error couldnt be parsed:', jsonError)
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error al obtener datos privados:', error)
      throw error //
    }
  }
}

export default AuthApiClient
