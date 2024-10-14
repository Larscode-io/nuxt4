export function useAuth() {
  const token = useState('auth_token', () => '')
  const destination = useState('auth_destination', () => '')

  const handleCallback = async (access_token: string, intendedDestination: string) => {
    console.log('handleCallback', access_token, intendedDestination)
    token.value = access_token
    destination.value = intendedDestination
    console.log('token', token.value)
    console.log('destination', destination.value)
  }
  return { handleCallback, token, destination }
}
