import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    videoUploadOnPasses: false,
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    videoUploadOnPasses: false,
  },
})
