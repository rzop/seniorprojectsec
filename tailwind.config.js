/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'floatSlow': 'floatSlow 6s ease-in-out infinite',
        'floatMedium': 'floatMedium 4s ease-in-out infinite',
        'floatFast': 'floatFast 3s ease-in-out infinite',
        'radar': 'radar 2s ease-out infinite',
        'sweep': 'sweep 3s linear infinite',
      },
      keyframes: {
        radar: {
          "0%":   { opacity: "0.25", transform: "scale(0.9)" },
          "60%":  { opacity: "0.14" },
          "100%": { opacity: "0.06", transform: "scale(1.12)" }
        },
        sweep: {
          "0%":  { transform: "rotate(0deg)"  },
          "100%":{ transform: "rotate(360deg)" }
        },
        floatSlow: {
          "0%":  { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-16px) translateX(12px)" },
          "100%":{ transform: "translateY(0) translateX(0)" }
        },
        floatSlower: {
          "0%":  { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(14px) translateX(-10px)" },
          "100%":{ transform: "translateY(0) translateX(0)" }
        }
      },
      animation: {
        radar: "radar 6s ease-in-out infinite",
        sweep: "sweep 6.5s linear infinite",
        floatSlow: "floatSlow 12s ease-in-out infinite",
        floatSlower: "floatSlower 18s ease-in-out infinite"
      },
      colors: {
        neon: {
          cyan: "#22d3ee",
          purple: "#a855f7"
        }
      }
    }
  },
  plugins: []
}
