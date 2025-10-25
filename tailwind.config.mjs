import typography from "@tailwindcss/typography";

const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/posts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: {
        DEFAULT: {
          css: {
            // fix mathjax inline formula auto line break issue
            "p > mjx-container": {
              display: "inline-block",
              "vertical-align": "middle",
              margin: "0",
              padding: "0",
            },
            // fix mathjax block formula not centering
            'mjx-container[display="true"] > svg': {
              display: "block",
              "margin-left": "auto",
              "margin-right": "auto",
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
