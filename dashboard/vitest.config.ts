import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      watch: false,
      coverage: {
        provider: 'istanbul',
        clean: true,
        exclude: ['src/**/__tests__', 'src/models', 'src/assets'],
        include: ['src'],
      },
    },
  }),
)
