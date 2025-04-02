import { defineConfig } from 'vite';
import { resolve } from 'path'


// export default defineConfig({
//     resolve: {
//         alias: {
//             src: '/src'
//         }
//     }
// });

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve('./', 'index.html'),
        nested: resolve('./src', 'GenzFighter/index.html'),
      },
    },
  },
})