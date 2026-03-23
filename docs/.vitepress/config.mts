import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "The Purple Terminal",
  description:
    "🦄 My corner of the Internet. Writing about DevOps, SRE, tools and specially things I learn, since sharing is caring",
  base: "/blog/",

  // Light mode by default and allowing the user change the theme
  appearance: {
    initialValue: "light",
  },

  // ── Head  ──
  head: [
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
        rel: "stylesheet",
      },
    ],
  ],

  themeConfig: {
    // ── Navigation ──────────────────────────────
    nav: [
      { text: "🏠 Home", link: "/" },
      { text: "📝 Blog", link: "/blog/" },
    ],

    // ── Sidebar ──────────────────────────────────
    sidebar: {
      "/blog/terminal/": [
        {
          text: "👻 Terminal & Tools",
          items: [
            {
              text: "Setting up Ghostty on macOS",
              link: "/blog/terminal/ghostty-setup",
            },
            {
              text: "Full Purple Terminal Configuration",
              link: "/blog/terminal/purple-terminal-setup",
            },
          ],
        },
      ],
      "/blog/devops/": [
        {
          text: "☁️ SRE / DevOps / Platform Engineering",
          items: [{ text: "Coming soon...", link: "/blog/devops/" }],
        },
      ],
      "/blog/system-design/": [
        {
          text: "🏗️ System Design",
          items: [
            {
              text: "🌟 Overview",
              link: "/blog/system-design/",
            },
            {
              text: "🔗 TinyURL",
              link: "/blog/system-design/tiny-url/",
              items: [
                {
                  text: "🔗 TinyURL - Monolithic",
                  link: "/blog/system-design/tiny-url/monolithic/README",
                },
                {
                  text: "🔗 TinyURL - Distributed",
                  link: "/blog/system-design/tiny-url/distributed/README",
                },
              ],
            },
          ],
        },
      ],
      "/blog/coding/": [
        {
          text: "💻 Coding",
          items: [{ text: "Coming soon...", link: "/blog/coding/" }],
        },
      ],
    },
    // ── Social links ─────────────────────────────
    socialLinks: [{ icon: "github", link: "https://github.com/verofa" }],

    // ── Footer ───────────────────────────────────
    footer: {
      message: "Built with 💜 and VitePress",
      copyright: `${new Date().getFullYear()} The Purple Terminal`,
    },

    // ── Search ───────────────────────────────────
    search: {
      provider: "local",
    },

    // ── Edit link ────────────────────────────────
    editLink: {
      pattern: "https://github.com/verofa/blog/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
  },

  // ── Purple theme colors ───────────────────────
  // The Purple terminal palette!
  vite: {
    css: {
      preprocessorOptions: {
        css: {
          additionalData: `
            :root {
              --vp-c-brand-1: #9D5FE0;
              --vp-c-brand-2: #7B2FBE;
              --vp-c-brand-3: #6B2FA0;
            }
          `,
        },
      },
    },
  },
});
