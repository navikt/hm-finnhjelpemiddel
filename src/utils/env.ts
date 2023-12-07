import { z, ZodError } from 'zod'

export type BundledEnv = z.infer<typeof bundledEnvSchema>
const bundledEnvSchema = z.object({
    NEXT_PUBLIC_RUNTIME_ENVIRONMENT: z.union([
        z.literal('local'),
        z.literal('dev'),
        z.literal('production'),
    ]),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
export const serverEnvSchema = z.object({
    // for unleash
    UNLEASH_SERVER_API_URL: z.string().optional(),
    UNLEASH_SERVER_API_TOKEN: z.string().optional(),
})

export const bundledEnv = bundledEnvSchema.parse({
    NEXT_PUBLIC_RUNTIME_ENVIRONMENT: process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT,
} satisfies Record<keyof BundledEnv, string | undefined>)

const getRawServerConfig = (): Partial<unknown> =>
    ({
        // Provided by nais-*.yml
        // for unleash
        UNLEASH_SERVER_API_URL: process.env.UNLEASH_SERVER_API_URL,
        UNLEASH_SERVER_API_TOKEN: process.env.UNLEASH_SERVER_API_TOKEN,
    }) satisfies Record<keyof ServerEnv, string | undefined>

/**
 * Server envs are lazy loaded and verified using Zod.
 */
export function getServerEnv(): ServerEnv & BundledEnv {
    try {
        return { ...serverEnvSchema.parse(getRawServerConfig()), ...bundledEnvSchema.parse(bundledEnv) }
    } catch (e) {
        if (e instanceof ZodError) {
            throw new Error(
                `The following envs are missing: ${
                    e.errors
                        .filter((it) => it.message === 'Required')
                        .map((it) => it.path.join('.'))
                        .join(', ') || 'None are missing, but zod is not happy. Look at cause'
                }`,
                { cause: e },
            )
        } else {
            throw e
        }
    }
}

export const isLocal =
    process.env.NODE_ENV !== 'production'
