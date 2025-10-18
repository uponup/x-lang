import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  lang: 'en-US',

  title: 'X-Lang',
  description: 'X-Lang: Code Smarter, in Every Language.',
  base: "/x-lang/",
  theme: defaultTheme({
    logo: './docs/images/logo.png',

    navbar: ['/', '/rust_p/']
  }),

  bundler: viteBundler(),
})