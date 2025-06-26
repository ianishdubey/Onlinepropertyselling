import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        properties: 'properties.html',
        about: 'about.html',
        login: 'login.html',
        profile: 'profile.html',
        admin: 'admin.html'
      }
    }
  },
  base: './'
})