import type { Config } from "tailwindcss";

// ENHANCED BY CURSOR AI: This Tailwind config includes custom palettes for customer and vendor themes.
export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// CUSTOMER PALETTE (CURSOR AI)
				cornflower_blue: { DEFAULT: '#589bee', 100: '#061e3b', 200: '#0c3c77', 300: '#125ab2', 400: '#1d78e9', 500: '#589bee', 600: '#79b0f2', 700: '#9bc3f5', 800: '#bcd7f8', 900: '#deebfc' },
				charcoal: { DEFAULT: '#444e59', 100: '#0e1012', 200: '#1c1f24', 300: '#292f36', 400: '#373f47', 500: '#444e59', 600: '#637281', 700: '#8895a3', 800: '#afb8c2', 900: '#d7dce0' },
				slate_gray: { DEFAULT: '#7c8a9e', 100: '#181b20', 200: '#303741', 300: '#485261', 400: '#5f6d81', 500: '#7c8a9e', 600: '#95a1b1', 700: '#b0b8c4', 800: '#cad0d8', 900: '#e5e7eb' },
				glaucous: { DEFAULT: '#5279ac', 100: '#111822', 200: '#213145', 300: '#324967', 400: '#42618a', 500: '#5279ac', 600: '#7594bd', 700: '#98afcd', 800: '#bacade', 900: '#dde4ee' },
				paynes_gray: { DEFAULT: '#576779', 100: '#121518', 200: '#232931', 300: '#353e49', 400: '#465361', 500: '#576779', 600: '#73859a', 700: '#96a4b3', 800: '#b9c2cc', 900: '#dce1e6' },
				silver: { DEFAULT: '#c5c1ba', 100: '#2a2723', 200: '#534e46', 300: '#7d7668', 400: '#a29b90', 500: '#c5c1ba', 600: '#d1cdc7', 700: '#dcdad5', 800: '#e8e6e3', 900: '#f3f3f1' },
				outer_space: { DEFAULT: '#434647', 100: '#0d0e0e', 200: '#1b1c1c', 300: '#282a2b', 400: '#353839', 500: '#434647', 600: '#676c6d', 700: '#8c9193', 800: '#b2b6b7', 900: '#d9dadb' },
				// VENDOR PALETTE (CURSOR AI)
				gray: { DEFAULT: '#797a83', 100: '#18181a', 200: '#303034', 300: '#48494e', 400: '#606168', 500: '#797a83', 600: '#93949b', 700: '#aeaeb4', 800: '#c9c9cd', 900: '#e4e4e6' },
				chamoisee: { DEFAULT: '#b07e66', 100: '#251913', 200: '#4a3226', 300: '#6f4a39', 400: '#94634c', 500: '#b07e66', 600: '#c19886', 700: '#d0b2a4', 800: '#e0ccc2', 900: '#efe5e1' },
				seasalt: { DEFAULT: '#f7f7f6', 100: '#34342f', 200: '#69695d', 300: '#9b9b8e', 400: '#c9c9c2', 500: '#f7f7f6', 600: '#f9f9f9', 700: '#fbfbfa', 800: '#fcfcfc', 900: '#fefefd' },
				silver_vendor: { DEFAULT: '#c4c2be', 100: '#292725', 200: '#514f4a', 300: '#7a766e', 400: '#a09d96', 500: '#c4c2be', 600: '#d0cfcc', 700: '#dcdbd8', 800: '#e8e7e5', 900: '#f3f3f2' },
				timberwolf: { DEFAULT: '#d2cec8', 100: '#2d2a25', 200: '#5a5349', 300: '#877d6e', 400: '#aca59a', 500: '#d2cec8', 600: '#dad7d2', 700: '#e3e1dd', 800: '#edebe9', 900: '#f6f5f4' },
				khaki: { DEFAULT: '#b5a49b', 100: '#27201d', 200: '#4d4039', 300: '#746056', 400: '#998175', 500: '#b5a49b', 600: '#c4b7af', 700: '#d3c9c3', 800: '#e2dbd7', 900: '#f0edeb' },
				timberwolf2: { DEFAULT: '#dbd9d6', 100: '#2e2c29', 200: '#5c5851', 300: '#8a847b', 400: '#b2aea9', 500: '#dbd9d6', 600: '#e2e1df', 700: '#e9e8e7', 800: '#f1f0ef', 900: '#f8f7f7' },
				davys_gray: { DEFAULT: '#4f4f56', 100: '#101011', 200: '#1f1f22', 300: '#2f2f33', 400: '#3f3f44', 500: '#4f4f56', 600: '#707079', 700: '#93939b', 800: '#b7b7bc', 900: '#dbdbde' },
				rich_black: { DEFAULT: '#171a21', 100: '#050507', 200: '#090a0d', 300: '#0e1014', 400: '#12151a', 500: '#171a21', 600: '#3c4457', 700: '#616e8c', 800: '#949eb5', 900: '#c9ceda' },
				licorice: { DEFAULT: '#251c1b', 100: '#080606', 200: '#0f0c0b', 300: '#171111', 400: '#1f1716', 500: '#251c1b', 600: '#5a4441', 700: '#8d6a66', 800: '#b49b98', 900: '#dacdcc' },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
