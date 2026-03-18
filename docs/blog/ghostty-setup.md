# 👻 Setting up Ghostty on macOS

_Published: March 2026 · 8 min read · Tags: `ghostty` `terminal` `macos` `setup`_

---

If you spend most of your day in a terminal, you deserve one that looks and feels amazing. In this post I'll walk you through how I set up **Ghostty** — a fast, modern terminal emulator — with a custom purple theme, transparency effects, and all the tweaks that make it a joy to use every day.

## 🤔 Why Ghostty?

There are a lot of terminal emulators out there — iTerm2, Alacritty, Warp, Kitty. I chose Ghostty because:

- ⚡ **Blazing fast**: written in Zig, native performance
- 🎨 **Highly customisable**: colors, fonts, opacity, blur
- 🐟 **Fish shell integration**: first class shell integration support
- 📦 **Simple config format**: plain key=value, no YAML/TOML complexity
- 🖥️ **Native macOS feel**: transparent titlebar, proper scrollback

## 📦 Installation

```fish
# Install via Homebrew
brew install --cask ghostty

# Verify
ghostty --version
```

> ℹ️ Ghostty requires macOS 12 or later.

---

## 🔤 Fonts — Install JetBrainsMono Nerd Font

Before configuring Ghostty, install a **Nerd Font**. These are regular fonts patched with thousands of extra icons used by Starship, Neovim and eza.

```fish
# Install via Homebrew
brew install --cask font-jetbrains-mono-nerd-font
```

Or manually:

1. Download from [nerdfonts.com](https://www.nerdfonts.com/font-downloads)
2. Unzip the archive
3. Copy `.ttf` files to `~/Library/Fonts/`

```fish
cp ~/Downloads/JetBrainsMono/*.ttf ~/Library/Fonts/
```

> ✅ You can verify the font is installed by opening **Font Book** and searching for "JetBrainsMono".

---

## ⚙️ Configuration

Ghostty's config file lives at:

```
~/.config/ghostty/config
```

Create it if it doesn't exist:

```fish
mkdir -p ~/.config/ghostty
nvim ~/.config/ghostty/config
```

Here's my complete config with explanations for every setting:

```ini
# ── Font ──────────────────────────────────────
font-family = "JetBrainsMono Nerd Font"
font-size = 13.5
font-thicken = true          # slightly bolder, easier on the eyes
adjust-cell-height = 10%     # a bit more line spacing

# ── Cursor ────────────────────────────────────
cursor-style = block         # block cursor (bar also available)
cursor-color = #F0EEF8       # near-white cursor
cursor-text = #1a1b26        # dark text on cursor

# ── Background ────────────────────────────────
background = #260f48          # deep purple
background-opacity = 0.90     # frosted glass effect
background-blur-radius = 20   # gaussian blur behind window

# ── Foreground ────────────────────────────────
foreground = #c9cfeb          # lavender-white text

# ── Selection ─────────────────────────────────
selection-background = #4E4870
selection-foreground = #F4F2FF

# ── macOS ─────────────────────────────────────
macos-titlebar-style = transparent   # seamless titlebar
window-padding-x = 12
window-padding-y = 8

# ── Shell integration ─────────────────────────
shell-integration = fish      # enables prompt marks, better scrollback

# ── Color palette ─────────────────────────────
# Normal colors (0-7)
palette = 0=#3D3B6B           # dark indigo
palette = 1=#A0566A           # dusty rose
palette = 2=#E8745A           # coral orange
palette = 3=#D4A828           # golden yellow
palette = 4=#8B72D4           # medium purple
palette = 5=#6B6AAA           # slate blue-purple
palette = 6=#6ED8B4           # soft mint
palette = 7=#DDDAF0           # near-white

# Bright colors (8-15)
palette = 8=#7B6FB8           # medium purple
palette = 9=#F0A0C0           # bubblegum pink
palette = 10=#E83870          # hot pink-red
palette = 11=#E0B830          # golden yellow
palette = 12=#AA98E8          # lavender
palette = 13=#8888BB          # muted slate
palette = 14=#88E8E0          # sky cyan
palette = 15=#F4F2FF          # near-white
```

---

## 🎨 Understanding the Color Palette

The color palette controls how your terminal renders colors when apps use the 16 standard ANSI colors. For example:

- Colors 0-7 are **normal** colors
- Colors 8-15 are **bright** variants
- Color 1 = red (used for errors), Color 2 = green (used for success), etc.

I pixel-matched these colors from a reference screenshot to get a cohesive purple-toned palette that looks great with dark backgrounds.

> 💡 **Tip:** You can preview your palette by running:
>
> ```fish
> for i in (seq 0 15)
>   printf (tput setaf $i)"Color $i "(tput sgr0)"\n"
> end
> ```

---

## 🖥️ The Result

With this config you get:

- 💜 Deep purple background with frosted glass transparency
- 🔤 JetBrainsMono with icons for Starship and eza
- ✨ Smooth blur effect showing your desktop through the terminal
- 🎨 A cohesive purple color palette throughout

---

## 💡 Tips & Tricks

**Reload config without restarting:**
Ghostty automatically reloads when you save the config file (no restart needed!)

**Increase font size temporarily:**

```
Cmd + =    increase font size
Cmd + -    decrease font size
Cmd + 0    reset to default
```

**Open a new window:**

```
Cmd + N
```

**Toggle fullscreen:**

```
Cmd + Ctrl + F
```

**Clear scrollback:**

```fish
clear && tput reset
```

---

## 🔗 What's Next?

Now that you have a beautiful terminal, the next steps are:

- 🐟 [Set up Fish shell with cloud CLI shortcuts](/blog/fish-shell-cloud-cli)
- 🚀 [Configure Starship prompt](/blog/starship-config)
- 💎 [Set up Neovim from scratch](/blog/neovim-setup)

Or jump straight to the [full setup guide](/setup-guide) to get everything running at once!

---

_Found this helpful? Share it with a fellow terminal enthusiast! 💜_
