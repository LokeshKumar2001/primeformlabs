/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        siemens: {
          petrol: "#00646e",
          petrolDark: "#004850",
          petrolLight: "#00828a",
          cyan: "#00a2ac",
          cyanBright: "#00cad5",
          steel: "#dce1e8",
          steelDark: "#2c3848",
          panel: "#edf1f5",
          widget: "#ffffff",
          bezel: "#1b2430",
          border: "#bcc7d4",
          softkey: "#2b4159",
          softkeyHover: "#395675",
          softkeyActive: "#00828a",
          text: "#1e293b",
          textMuted: "#64748b"
        },
        hmi: {
          green: "#16a34a",
          greenLight: "#22c55e",
          greenDark: "#14532d",
          red: "#dc2626",
          redLight: "#ef4444",
          redDark: "#7f1d1d",
          amber: "#d97706",
          amberLight: "#f59e0b",
          amberDark: "#78350f"
        }
      },
      fontFamily: {
        sans: ['Arial', '"Helvetica Neue"', 'Helvetica', '"Segoe UI"', 'sans-serif'],
        ui: ['Arial', '"Helvetica Neue"', 'Helvetica', '"Segoe UI"', 'sans-serif'],
        mono: ['"Consolas"', '"Courier New"', 'monospace'],
        display: ['Arial', '"Helvetica Neue"', 'Helvetica', 'sans-serif'],
        body: ['Arial', '"Helvetica Neue"', 'Helvetica', 'sans-serif']
      },
      boxShadow: {
        softkey: "0 2px 5px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
        widget: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
        sinumerikBezel: "0 8px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
      }
    },
  },
  plugins: [],
}
