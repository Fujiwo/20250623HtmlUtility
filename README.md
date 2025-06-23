# HTML ↔ Markdown Converter

A web-based bidirectional converter that transforms HTML to Markdown and vice versa, built with vanilla HTML, CSS, and JavaScript.

## Features

- **Bidirectional Conversion**: Convert HTML to Markdown and Markdown to HTML
- **Comprehensive Support**: Handles headers, paragraphs, bold/italic text, links, images, code blocks, lists, tables, blockquotes, and horizontal rules
- **Real-time Conversion**: Instant conversion with button clicks
- **Copy to Clipboard**: Easy copying of converted content
- **Responsive Design**: Works on desktop and mobile devices
- **Visual Feedback**: Success/error indicators and animations

## Usage

1. Open `index.html` in a web browser
2. Paste your HTML or Markdown content in the respective input areas
3. Click the convert button to transform the content
4. Copy the output using the copy button

## Supported Elements

### HTML to Markdown
- Headers (h1-h6) → # ## ### #### ##### ######
- Bold/Strong → **text**
- Italic/Emphasis → *text*
- Code inline → `code`
- Code blocks → ```code```
- Links → [text](url)
- Images → ![alt](src)
- Lists (ul/ol) → - item / 1. item
- Blockquotes → > text
- Horizontal rules → ---
- Tables → | column | column |

### Markdown to HTML
- Headers # ## ### → h1 h2 h3
- **bold** → strong
- *italic* → em
- `code` → code
- ```code``` → pre/code
- [text](url) → a href
- ![alt](src) → img
- Lists - / 1. → ul/ol li
- > blockquote → blockquote
- --- → hr

## Files

- `index.html` - Main application interface
- `styles.css` - Styling and responsive design
- `script.js` - Conversion logic and UI interactions

## Browser Compatibility

Works in all modern browsers that support:
- ES6 Classes
- Async/Await
- Clipboard API (with fallback for older browsers)

## License

Open source - feel free to use and modify.