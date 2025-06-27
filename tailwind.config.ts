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
					DEFAULT: '#F4D03F',
					50: '#FEFBF0',
					100: '#FDF7E0',
					200: '#FBF0C0',
					300: '#F9E8A0',
					400: '#F7E180',
					500: '#F4D03F',
					600: '#F2C61F',
					700: '#E6B800',
					800: '#B38F00',
					900: '#806600'
				},
				licorice: { 
					DEFAULT: '#1A1A1A',
					50: '#F5F5F5',
					100: '#EBEBEB',
					200: '#D7D7D7',
					300: '#C3C3C3',
					400: '#AFAFAF',
					500: '#1A1A1A',
					600: '#171717',
					700: '#141414',
					800: '#111111',
					900: '#0E0E0E'
				},
				brown: { 
					DEFAULT: '#8B4513',
					50: '#F5F0EB',
					100: '#EBE1D7',
					200: '#D7C3AF',
					300: '#C3A587',
					400: '#AF875F',
					500: '#8B4513',
					600: '#7A3D11',
					700: '#69350F',
					800: '#582D0D',
					900: '#47250B'
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
					DEFAULT: '#6B7280',
					50: '#F9FAFB',
					100: '#F3F4F6',
					200: '#E5E7EB',
					300: '#D1D5DB',
					400: '#9CA3AF',
					500: '#6B7280',
					600: '#4B5563',
					700: '#374151',
					800: '#1F2937',
					900: '#111827'
				},
				chamoisee: { 
					DEFAULT: '#A0785A',
					50: '#F7F4F1',
					100: '#EFE9E3',
					200: '#DFD3C7',
					300: '#CFBDAB',
					400: '#BFA78F',
					500: '#A0785A',
					600: '#8B6A4E',
					700: '#765C42',
					800: '#614E36',
					900: '#4C402A'
				},
				seasalt: { 
					DEFAULT: '#F8F9FA',
					50: '#FFFFFF',
					100: '#FEFEFE',
					200: '#FDFDFD',
					300: '#FCFCFC',
					400: '#FAFAFA',
					500: '#F8F9FA',
					600: '#E9ECEF',
					700: '#DEE2E6',
					800: '#CED4DA',
					900: '#ADB5BD'
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
					DEFAULT: '#C3B091',
					50: '#F8F6F2',
					100: '#F1EDE5',
					200: '#E3DBCB',
					300: '#D5C9B1',
					400: '#C7B797',
					500: '#C3B091',
					600: '#B19D7F',
					700: '#9F8A6D',
					800: '#8D775B',
					900: '#7B6449'
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
				// Modern Solar Website Colors (from template)
				solar: {
					primary: "#32C36C",
					light: "#F6F7F8", 
					dark: "#1A2A36",
					secondary: "#FF6B35",
					accent: "#4A90E2",
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
				},
				'slide-in': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' },
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-right': 'slide-right 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'bounce-in': 'bounce-in 0.6s ease-out',
			},
			fontFamily: {
				sans: ['Open Sans', 'Roboto', 'system-ui', 'sans-serif'],
				heading: ['Roboto', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				'solar': '0 10px 25px -3px rgba(50, 195, 108, 0.1), 0 4px 6px -2px rgba(50, 195, 108, 0.05)',
				'solar-lg': '0 20px 25px -3px rgba(50, 195, 108, 0.1), 0 10px 10px -5px rgba(50, 195, 108, 0.04)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
