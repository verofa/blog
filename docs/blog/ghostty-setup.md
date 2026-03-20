# 👻 Setting up Ghostty on macOS

_Published: March 2026 · 8 min read · Tags: `ghostty` `terminal` `macos` `setup`_

---

If you spend most of your day in a terminal, you deserve one that looks and feels amazing.
In this post I'll walk you through how I set up **[Ghostty]** (a fast, modern terminal emulator)
with a custom purple theme, transparency effects, and all the tweaks that make it a joy to use
every day.

## 🤔 Why Ghostty?

There are a lot of terminal emulators out there e.g., **iTerm2**, **Alacritty**, **Warp**, **Kitty**.
I chose `Ghostty` because:

- ⚡ **Blazing fast**: written in Zig, native performance
- 🎨 **Highly customisable**: colors, fonts, opacity, blur
- 🐟 **Fish shell integration**: first class shell integration support
- 📦 **Simple config format**: plain key=value, no YAML/TOML complexity
- 🖥️ **Native macOS feel**: transparent titlebar, proper scrollback

## 📦 Installation

```fish
# Open a terminal and install it via Homebrew
brew install --cask ghostty
```

When the installation finish, close the terminal and open a new terminal session from Ghostty:
Open Spotlight Search and type Ghostty (or press Command (⌘) + Space and type Ghostty)

```fish
# Check version
ghostty --version
```

> [!IMPORTANT]
> Ghostty requires macOS 12 or later and to install the cask you need to have
> [Homebrew installed]

---

## Customisation

At the end of the following instructions your `Ghostty` terminal will look like this:

![Ghostty terminal](/ghostty-setup/ghostty-terminal.png)

## 🔤 Fonts: Install JetBrainsMono Nerd Font

Before configuring `Ghostty`, install a **Nerd Font**. These are regular fonts patched with thousands
of extra icons used by [Starship], [Neovim] and [eza].

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
>
> Open `Finder`, navigate to the `Applications` folder, and select `Font Book.`

---

## ⚙️ Configuration

[Ghostty's config] file lives at (macOS only):

```
$HOME/Library/Application\ Support/com.mitchellh.ghostty/config.ghostty
$HOME/Library/Application\ Support/com.mitchellh.ghostty/config
```

Here is my complete `config` with explanations for every setting:

> [!TIP]
> If you want to try it, you can download it into your configuration location, and test it:
>
> ```fish
> curl \
> "https://raw.githubusercontent.com/verofa/dotfiles/refs/heads/main/Library/Application%20Support/com.mitchellh.ghostty/config" -o ./config
> ```

```ini
# =====================================================================
#  Ghostty Configuration — High Contrast / Professional Theme
#  macOs Location:
#  ~/Library/Application Support/com.mitchellh.ghostty/config
#  or
#  /Library/Application\ Support/com.mitchellh.ghostty/config.ghostty
#  Linux Location:
#  ~/.config/ghostty/config
#
#  Ghostty docs:     https://ghostty.org/docs/config
#  Show all options: ghostty +show-config --default --docs
#
#  Syntax quick-reference:
#    key = value       # basic assignment
#    key =             # reset to default
#    # comment         # whole-line comment only (no inline comments)
# =====================================================================

# -- Font -------------------------------------------------------------
#  Primary font is JetBrains Mono with Nerd Font patching (adds icons
#  used by tools like Starship, Neovim plugins, etc.).
#  Font features enabled:
#    calt  – contextual alternates (e.g. arrow ligatures: ->  =>)
#    liga  – standard ligatures
#    ss01/ss02 – stylistic sets (variant letterforms, varies by font)
#  font-thicken renders glyphs slightly bolder on macOS Retina screens.

font-family = "JetBrainsMono Nerd Font"
font-size = 13.5
font-feature = calt
font-feature = liga
font-feature = ss01
font-feature = ss02
font-thicken = true

# -- Cursor -----------------------------------------------------------
#  A non-blinking bar cursor (|) is less distracting than a block.
#  The hot-pink cursor (#f95470) contrasts sharply against the dark
#  background, making it easy to locate at a glance.
#  cursor-text sets the colour of the character *under* the cursor.

cursor-style        = bar
cursor-style-blink  = false
cursor-color        = #f95470
cursor-text         = #1a1b26

# -- Window & Decorations ---------------------------------------------
#  Generous padding (18 px horizontal, 14 px vertical) keeps text
#  away from the window edges — easier on the eyes during long sessions.
#  macos-titlebar-style = transparent blends the title bar into the
#  terminal background for a cleaner, full-bleed look.
#  resize-overlay = never suppresses the size pop-up when dragging
#  the window border.

window-padding-x         = 18
window-padding-y         = 14
window-decoration        = true
window-title-font-family = "Berkeley Mono"
macos-titlebar-style     = transparent
resize-overlay           = never

# -- Base Colors ------------------------------------------------------
#  Deep purple background (#260f48) with slight transparency (0.90)
#  lets the desktop bleed through subtly. background-blur-radius = 20
#  smooths whatever is behind the window (macOS vibrancy-style effect).
#  The foreground is a neutral light grey (#C0C0C0) — bright enough
#  for legibility without the eye-strain of pure white.

background              = #260f48
background-opacity      = 0.90
background-blur-radius  = 20
foreground              = #C0C0C0

# Commented-out foreground alternatives — uncomment to try:
# foreground = #E8EAF0   # slightly bluer white
# foreground = #C8C0DC   # warm lavender tint
# foreground = #c9cfeb   # soft periwinkle

# -- 16-Colour Palette ------------------------------------------------
#  Terminals use a fixed palette of 16 colours (indices 0–15).
#  Indices 0–7  are the "normal" colours.
#  Indices 8–15 are the "bright" variants (used for bold text, etc.).
#
#  This palette leans into a vibrant neon-on-dark aesthetic while
#  keeping contrast ratios high for readability.

# Backgrounds, borders, inactive elements
palette = 0=#1C2333
palette = 8=#3B4560

# Errors, git deletions, warnings
palette = 1=#ef919b
palette = 9=#FF6B82

# Success, git additions, OK status
palette = 2=#00E676
palette = 10=#52FF9A

# Warnings, modified files, highlights
palette = 3=#FFD600
palette = 11=#FFE44D

# Directories, prompts, links
palette = 4=#88E8E0
palette = 12=#6EA6FF

# Special files, tags, decorators
palette = 5=#E040FB
palette = 13=#EA80FC

# Strings, info messages
palette = 6=#dd95aa
palette = 14=#EA80FC

# Normal text, foreground fallback
palette = 7=#C9D1E8
palette = 15=#FFFFFF

# --- Selection -------------------------------------------------------
#  Dark navy selection background with pure white text ensures
#  selected text remains fully legible against any content.

selection-background = #1E3A5F
selection-foreground = #FFFFFF

# -- Scrollback -------------------------------------------------------
#  Stores up to 10,000 lines of output above the visible viewport.
#  Increase if you regularly work with long build logs or verbose output.

scrollback-limit = 10000

# -- Shell Integration --------------------------------------------------
#  Ghostty has native integration with Fish shell. This enables:
#  cursor  – shell reports its mode (insert/normal) so the cursor
#              shape changes automatically (bar in insert, block in normal)
#  sudo    – passes terminal info through sudo sessions
#  title   – sets the window title to the current command / directory

shell-integration          = fish
shell-integration-features = cursor,sudo,title

# -- Miscellaneous Behaviour -----------------------------------------------
# confirm-close-surface = false - close tabs/windows instantly, no dialog.
# focus-follows-mouse   = false - focus only changes on click, not hover.
# copy-on-select        = false - text is NOT auto-copied when highlighted;
#                                 requires an explicit Cmd+C / right-click.
# clipboard-trim-trailing-spaces - strips trailing whitespace when copying,
#                                  avoiding invisible characters in pastes.
confirm-close-surface          = false
focus-follows-mouse            = false
copy-on-select                 = false
clipboard-trim-trailing-spaces = true
```

---

## 🎨 Understanding the Color Palette

The color palette controls how your terminal renders colors when apps use the 16 standard ANSI
colors. For example:

- Colors 0-7 are **normal** colors
- Colors 8-15 are **bright** variants
- Color 1 = red (used for errors), Color 2 = green (used for success), etc.

I pixel matched these colors to get a cohesive purple toned palette
that looks great with dark backgrounds.

> 💡 **Tip:** You can preview your palette by running:
>
> ```fish
> for i in (seq 0 15)
>   printf (tput setaf $i)"Color $i "(tput sgr0)"\n"
> end
> ```

---

## 🖥️ The Result

![Ghostty fastfetch](/ghostty-setup/system-info.png)

With this config you get:

- 💜 Deep purple background with frosted glass transparency
- 🔤 **JetBrainsMono** with icons for [Starship] and [eza]
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

---

## 🔗 What's Next?

Now that you have a beautiful terminal, the next steps are:

- 🐟 [Set up Fish shell with cloud CLI shortcuts](/blog/fish-shell-cloud-cli)
- 🚀 [Configure Starship prompt](/blog/starship-config)
- 💎 [Set up Neovim from scratch](/blog/neovim-setup)

Or jump straight to the [full setup guide](/setup-guide) to get everything running at once!

---

_Found this helpful? Share it with a fellow terminal enthusiast! 💜_

[Ghostty]: https://ghostty.org
[Starship]: https://starship.rs/
[eza]: https://eza.rocks/
[Neovim]: https://neovim.io/
[Ghostty's config]: https://ghostty.org/docs/config
[Homebrew installed]: https://github.com/verofa/dotfiles/blob/main/SETUP.md#2-homebrew
