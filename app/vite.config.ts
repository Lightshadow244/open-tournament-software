// import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Features } from 'lightningcss';


export default defineConfig({ 
    plugins: [sveltekit({})],
    css: {
        transformer: 'lightningcss',
        lightningcss: {
            exclude: Features.LightDark
        }
  }
});