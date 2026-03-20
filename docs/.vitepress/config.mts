import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "The Purple Terminal",
  description:
    "🦄 My corner of the Internet. Writing about DevOps, SRE, tools and specially things I learn, since sharing is caring",
  base: "/blog/",

  // Dark mode by default
  // appearance: "dark",

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
      "/blog/": [
        {
          text: "📝 Blog Posts",
          items: [
            {
              text: "Setting up Ghostty on macOS",
              link: "/blog/ghostty-setup",
            },
            {
              text: "Full Purple Terminal configuration",
              link: "/blog/purple-terminal-setup",
            },
          ],
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
