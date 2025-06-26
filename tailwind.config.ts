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
				// Common theme colors (blue/gray/silver palette)
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
				glaucous: { 
					DEFAULT: '#5279ac', 
					100: '#111822', 200: '#213145', 300: '#324967', 400: '#42618a', 
					500: '#5279ac', 600: '#7594bd', 700: '#98afcd', 800: '#bacade', 900: '#dde4ee' 
				},
				payne_gray: { 
					DEFAULT: '#576779', 
					100: '#121518', 200: '#232931', 300: '#353e49', 400: '#465361', 
					500: '#576779', 600: '#73859a', 700: '#96a4b3', 800: '#b9c2cc', 900: '#dce1e6' 
				},
				silver: { 
					DEFAULT: '#c5c1ba', 
					100: '#2a2723', 200: '#534e46', 300: '#7d7668', 400: '#a29b90', 
					500: '#c5c1ba', 600: '#d1cdc7', 700: '#dcdad5', 800: '#e8e6e3', 900: '#f3f3f1' 
				},
				outer_space: { 
					DEFAULT: '#434647', 
					100: '#0d0e0e', 200: '#1b1c1c', 300: '#282a2b', 400: '#353839', 
					500: '#434647', 600: '#676c6d', 700: '#8c9193', 800: '#b2b6b7', 900: '#d9dadb' 
				},
				// Customer theme colors (yellow/brown/blue-green palette)
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
				selective_yellow: { 
					DEFAULT: '#f8b200', 
					100: '#322400', 200: '#644800', 300: '#966b00', 400: '#c88f00', 
					500: '#f8b200', 600: '#ffc42f', 700: '#ffd363', 800: '#ffe297', 900: '#fff0cb' 
				},
				black_bean: { 
					DEFAULT: '#3d1604', 
					100: '#0c0401', 200: '#190902', 300: '#250d02', 400: '#321203', 
					500: '#3d1604', 600: '#923509', 700: '#e5530f', 800: '#f48a58', 900: '#fac4ac' 
				},
				blue_green: { 
					DEFAULT: '#0895c6', 
					100: '#021e27', 200: '#033c4e', 300: '#055976', 400: '#07779d', 
					500: '#0895c6', 600: '#14bdf5', 700: '#4fcdf8', 800: '#89defa', 900: '#c4eefd' 
				},
				cafe_noir: { 
					DEFAULT: '#503314', 
					100: '#100a04', 200: '#211508', 300: '#311f0c', 400: '#412a10', 
					500: '#503314', 600: '#935e25', 700: '#ce873b', 800: '#deaf7c', 900: '#efd7be' 
				},
				// Vendor theme colors (gray/chamoisee/khaki palette)
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
				vendor_silver: { 
					DEFAULT: '#c4c2be', 
					100: '#292725', 200: '#514f4a', 300: '#7a766e', 400: '#a09d96', 
					500: '#c4c2be', 600: '#d0cfcc', 700: '#dcdbd8', 800: '#e8e7e5', 900: '#f3f3f2' 
				},
				timberwolf: { 
					DEFAULT: '#d2cec8', 
					100: '#2d2a25', 200: '#5a5349', 300: '#877d6e', 400: '#aca59a', 
					500: '#d2cec8', 600: '#dad7d2', 700: '#e3e1dd', 800: '#edebe9', 900: '#f6f5f4' 
				},
				khaki: { 
					DEFAULT: '#b5a49b', 
					100: '#27201d', 200: '#4d4039', 300: '#746056', 400: '#998175', 
					500: '#b5a49b', 600: '#c4b7af', 700: '#d3c9c3', 800: '#e2dbd7', 900: '#f0edeb' 
				},
				timberwolf_2: { 
					DEFAULT: '#dbd9d6', 
					100: '#2e2c29', 200: '#5c5851', 300: '#8a847b', 400: '#b2aea9', 
					500: '#dbd9d6', 600: '#e2e1df', 700: '#e9e8e7', 800: '#f1f0ef', 900: '#f8f7f7' 
				},
				davy_gray: { 
					DEFAULT: '#4f4f56', 
					100: '#101011', 200: '#1f1f22', 300: '#2f2f33', 400: '#3f3f44', 
					500: '#4f4f56', 600: '#707079', 700: '#93939b', 800: '#b7b7bc', 900: '#dbdbde' 
				},
				rich_black: { 
					DEFAULT: '#171a21', 
					100: '#050507', 200: '#090a0d', 300: '#0e1014', 400: '#12151a', 
					500: '#171a21', 600: '#3c4457', 700: '#616e8c', 800: '#949eb5', 900: '#c9ceda' 
				},
				vendor_licorice: { 
					DEFAULT: '#251c1b', 
					100: '#080606', 200: '#0f0c0b', 300: '#171111', 400: '#1f1716', 
					500: '#251c1b', 600: '#5a4441', 700: '#8d6a66', 800: '#b49b98', 900: '#dacdcc' 
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
