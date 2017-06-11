| **Master** | **Develop** |
|   :---:    |    :---:    |
| <img src="https://circleci.com/gh/TroyAlford/wiki-editor/tree/master.svg?style=shield&circle-token=5bc81f2dd54fb564946ce1520076f242c0c1529e" /> | <img class="float-left" src="https://circleci.com/gh/TroyAlford/wiki-editor/tree/develop.svg?style=shield&circle-token=5bc81f2dd54fb564946ce1520076f242c0c1529e" /> |

# Wiki-Editor
A React/Slate WYSIWYG editor

## Current Plugins

### Alignment
Supports `align: left|right|justify` and `float: left|right`

### Anchor
Allows editing of `a` tags via Markdown syntax: `[text](href)`. Whenever the cursor enters a hyperlink, it will be automatically converted to Markdown. As soon as the cursor leaves this Markdown, it automatically converts back into a hyperlink.

### AutoReplacers
Supports case-insensitive, automatic conversion of:
* `(c)` to ©
* `(r)` to ®
* `(tm)` to ™
* `--` to `<hr />` (2+ `-` on a single line, converted on pressing `Enter` at the end of the line)
* `#{1,6}` to `<h1>` through `<h6>` (start a new line with `#`'s, and press `Space`)

### Header
Supports a toolbar dropdown menu for converting the current line from `<p>` to `<h1>` to `<h6>`

### HorizontalRule
Supports keyboard navigation around `<hr />` tags

### Paragraph
Supports basic `<p>` tag rendering, compatible with the **Alignment** plugin

### Table
Provides keyboard navigation, toolbar support, and hotkeys for editing `<table>`s and their children. All hotkeys use `⌘+Shift` _and_ `Ctrl+Shift` plus the keystroke below.
* Add Table
* Clear Cell Contents: Hotkey+`Delete`
* Insert Column to Left: Hotkey+`Left`
* Insert Column to Right: Hotkey+`Right`
* Insert Row Above: Hotkey+`Up`
* Insert Row Below: Hotkey+`Down`
* Toggle `TD`/`TH`: Hotkey+`H`
* Delete Table

### TextDecorators
* Toggle Bold: `Ctrl` or `⌘` + `b`
* Toggle Italic: `Ctrl` or `⌘` + `i`
* Toggle Strike: `Ctrl` or `⌘` + `d`
* Toggle Underline: `Ctrl` or `⌘` + `u`
* Toggle Superscript: `Ctrl` or `⌘` + `Up`
* Toggle Subscript: `Ctrl` or `⌘` + `Down`
