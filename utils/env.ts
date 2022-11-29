type AvailableEnv = 'RUNTIME_ENVIRONMENT' | 'HM_SEARCH_URL'

export function getEnv(name: AvailableEnv): string {
  if (typeof window !== 'undefined') {
    throw new Error(`Illegal isomorphic access: Tried to access environment with name "${name}" on client side`)
  }

  const envVar = process.env[name]
  if (envVar == null) {
    throw new Error(`No key with name "${name}" found in environment`)
  }
  return envVar
}
