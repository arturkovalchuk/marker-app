/** @type {import('tailwindcss').Config} */
declare module 'tailwindcss/tailwind-config' {
  interface TailwindConfig {
    content: string[]
    theme: {
      extend: Record<string, unknown>
    }
    plugins: any[]
  }
}

declare const config: TailwindConfig
export default config 