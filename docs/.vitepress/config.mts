import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "The Purple Terminal",
  description:
    "🦄 My corner of the Internet. Writing about DevOps, SRE, tools and specially things I learn, since sharing is caring",

  // Dark mode by default — matches your terminal!
  appearance: "dark",

  themeConfig: {
    // ── Navigation ──────────────────────────────
    nav: [
      { text: "🏠 Home", link: "/" },
      { text: "📝 Blog", link: "/blog/" },
      { text: "🛠️ Setup Guide", link: "/setup-guide" },
      { text: "⚙️ Config", link: "/config/" },
      { text: "🔧 Troubleshooting", link: "/troubleshooting" },
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
              text: "Fish Shell — Cloud CLI shortcuts",
              link: "/blog/fish-shell-cloud-cli",
            },
            {
              text: "Starship prompt configuration",
              link: "/blog/starship-config",
            },
            { text: "Neovim from scratch", link: "/blog/neovim-setup" },
            {
              text: "Fixing nvim-treesitter v1 changes",
              link: "/blog/nvim-treesitter-v1",
            },
            {
              text: "Neovim LSP — Migrating to 0.11",
              link: "/blog/nvim-lsp-0-11",
            },
          ],
        },
      ],
      "/config/": [
        {
          text: "⚙️ Config Files",
          items: [
            { text: "Ghostty", link: "/config/ghostty" },
            { text: "Fish Shell", link: "/config/fish" },
            { text: "Starship", link: "/config/starship" },
            { text: "Neovim", link: "/config/neovim" },
          ],
        },
      ],
    },

    // ── Social links ─────────────────────────────
    socialLinks: [{ icon: "github", link: "https://github.com/verofa" }],

    // ── Footer ───────────────────────────────────
    footer: {
      message: "Built with 💜 and VitePress",
      copyright: `Copyright © ${new Date().getFullYear()} The Purple Terminal`,
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
  // Matches your Ghostty terminal palette!
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
