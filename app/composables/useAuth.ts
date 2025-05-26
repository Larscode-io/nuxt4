export function useAuth() {
  const token = useState('auth_token', () => '')
  const destination = useState('auth_destination', () => '')

  const handleCallback = async (access_token: string, intendedDestination: string) => {
    token.value = access_token
    destination.value = intendedDestination
  }
  return { handleCallback, token, destination }
}
