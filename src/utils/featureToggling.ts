import { evaluateFlags, flagsClient, getDefinitions, randomSessionId } from '@unleash/nextjs'

export async function featureIsEnabled(featureName: string, userId = randomSessionId()) {
  const definitions = await getDefinitions()
  const { toggles } = evaluateFlags(definitions!!, { userId })
  const flags = flagsClient(toggles)
  return flags.isEnabled(featureName)
}
