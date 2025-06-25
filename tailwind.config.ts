
import type { Config } from "tailwindcss";

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
				// Common theme colors
				cornflower_blue: { 
					DEFAULT: '#589bee', 
					100: '#061e3b', 200: '#0c3c77', 300: '#125ab2', 400: '#1d78e9', 
					500: '#589bee', 600: '#79b0f2', 700: '#9bc3f5', 800: '#bcd7f8', 900: '#deebfc' 
				},
				charcoal: { 
					DEFAULT: '#444e59', 
					100: '#0e1012', 200: '#1c1f24', 300: '#292f36', 400: '#373f47', 
					500: '#444e59', 600: '#637281', 700: '#8895a3', 800: '#afb8c2', 900: '#d7dce0' 
				},
				slate_gray: { 
					DEFAULT: '#7c8a9e', 
					100: '#181b20', 200: '#303741', 300: '#485261', 400: '#5f6d81', 
					500: '#7c8a9e', 600: '#95a1b1', 700: '#b0b8c4', 800: '#cad0d8', 900: '#e5e7eb' 
				},
				// Customer theme colors
				jonquil: { 
					DEFAULT: '#fecb00', 
					100: '#332900', 200: '#665200', 300: '#997a00', 400: '#cca300', 
					500: '#fecb00', 600: '#ffd633', 700: '#ffe066', 800: '#ffeb99', 900: '#fff5cc' 
				},
				licorice: { 
					DEFAULT: '#190a02', 
					100: '#050200', 200: '#090401', 300: '#0e0601', 400: '#130802', 
					500: '#190a02', 600: '#712e09', 700: '#cb5210', 800: '#f0854c', 900: '#f8c2a5' 
				},
				brown: { 
					DEFAULT: '#8b4a08', 
					100: '#1c0f02', 200: '#381e03', 300: '#542c05', 400: '#703b07', 
					500: '#8b4a08', 600: '#d06e0c', 700: '#f39232', 800: '#f7b776', 900: '#fbdbbb' 
				},
				// Vendor theme colors
				vendor_gray: { 
					DEFAULT: '#797a83', 
					100: '#18181a', 200: '#303034', 300: '#48494e', 400: '#606168', 
					500: '#797a83', 600: '#93949b', 700: '#aeaeb4', 800: '#c9c9cd', 900: '#e4e4e6' 
				},
				chamoisee: { 
					DEFAULT: '#b07e66', 
					100: '#251913', 200: '#4a3226', 300: '#6f4a39', 400: '#94634c', 
					500: '#b07e66', 600: '#c19886', 700: '#d0b2a4', 800: '#e0ccc2', 900: '#efe5e1' 
				},
				seasalt: { 
					DEFAULT: '#f7f7f6', 
					100: '#34342f', 200: '#69695d', 300: '#9b9b8e', 400: '#c9c9c2', 
					500: '#f7f7f6', 600: '#f9f9f9', 700: '#fbfbfa', 800: '#fcfcfc', 900: '#fefefd' 
				},
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
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-right': {
					'0%': {
						transform: 'translateX(100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-right': 'slide-right 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
