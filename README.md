# DevFusion v2.1.0

An developer toolkit built with vanilla JavaScript, HTML, and CSS. DevFusion provides a suite of powerful tools for developers without any framework dependencies.

## 🚀 Features

### 1. **Advanced Diff Viewer**
- Compare two text documents or code files
- Support for `.txt`, `.js`, `.py`, `.json`, `.css`, `.html`, `.xml`, `.md`, `.java`, `.cpp`, `.c`, `.ts`, `.jsx`, `.tsx`
- Multiple diff algorithms:
  - Line-by-line comparison
  - Word-by-word comparison
  - Character-level comparison
- Options:
  - Ignore whitespace differences
  - Case-insensitive comparison
- Real-time similarity calculation (0-100%)
- Color-coded diff output (added/removed/modified)
- Upload files via drag-drop or file picker
- Comprehensive statistics display

### 2. **JSON Beautifier & Comparator**
- **Single Mode**: Format, minify, and edit JSON with syntax highlighting
- **Compare Mode**: Compare two JSON objects side-by-side
  - Automatic key difference detection
  - Nested object comparison
  - Detailed change tracking (added/removed/modified)
- **Tree Mode**: Visual tree structure for complex JSON
- Format with custom indentation
- Real-time JSON validation

### 3. **Advanced Regex Tester**
- Live regex testing with instant results
- Flag support: Global (g), Multiline (m), Case-insensitive (i)
- Quick preset patterns:
  - Email validation
  - Phone number patterns
  - URL matching
  - IPv4 addresses
  - Hex color codes
  - Date patterns (YYYY-MM-DD)
- Capture group highlighting
- Match position and count display
- Real-time highlighting of matches in test string

### 4. **String & Hash Utility**
- **Encode/Decode**:
  - Base64 encoding/decoding
  - URL encoding/decoding
  - HTML entity encoding/decoding
- **Hash Generator**:
  - MD5 hashing
  - SHA-1 hashing
  - SHA-256 hashing
  - SHA-512 hashing
- **Transform**:
  - UPPERCASE conversion
  - lowercase conversion
  - Capitalize words
  - Text reversal
  - Remove spaces
  - Trim whitespace
- One-click copy to clipboard

### 5. **Text Analyzer**
- Real-time text analysis
- Statistics:
  - Line count
  - Word count
  - Character count
  - Non-whitespace character count
  - Paragraph count
  - Duplicate line detection
- Advanced metrics:
  - Average word length
  - Longest word identification
  - Shortest word identification
  - Word frequency analysis (top 10)
- Visual statistics cards with icons

### 6. **File Comparator**
- Drag-and-drop file upload (dual panels)
- Automatic format detection
- File comparison with:
  - Line-by-line diff display
  - Similarity percentage
  - Change statistics
  - Addition/deletion counts
- Summary report generation
- Support for all common code file types

### 7. **Color Picker**
- Interactive color selection
- Multiple color format displays:
  - Hexadecimal (#RRGGBB)
  - RGB (r, g, b)
  - HSL (h, s, l)
- Color palette generation:
  - 8 gradient shades from 12.5% to 100%
  - Complementary color calculation
  - Analogous colors (±30°)
- One-click copy of any color value
- Live preview panel

### 8. **UUID Generator**
- Generate multiple UUIDs at once
- Version support:
  - UUID v4 (Random - recommended)
  - UUID v1 (Timestamp-based)
- Batch generation (1-1000 UUIDs)
- Uppercase option
- Copy individual or all UUIDs
- Formatted display with copy icons

### 9. **Timestamp Converter**
- Real-time current timestamp display
- **Timestamp to Date**: Convert Unix timestamps to readable dates
  - Auto-detect seconds vs milliseconds
  - Multiple format outputs:
    - Standard date/time
    - ISO 8601 format
    - UTC string
    - Locale-specific format
- **Date to Timestamp**: Convert dates to Unix timestamps
  - Seconds and milliseconds output
  - Local and UTC representations

### 10. **JWT Decoder**
- Decode JSON Web Tokens
- Display components:
  - Header (algorithm and type)
  - Payload (claims and data)
  - Signature
- Automatic expiration detection
- Expired/Valid status indicator
- Pretty-printed JSON output

### 11. **Terminal Interface** (Ctrl+~)
Fully functional command-line interface with:
- **Available Commands**:
  - `help` - Show available commands
  - `diff <text1> <text2>` - Compare texts
  - `hash "text"` - Generate MD5 and SHA-256
  - `regex "pattern" "text"` - Test regex
  - `encode <type> "text"` - Encode (base64/url/html)
  - `decode <type> "text"` - Decode (base64/url/html)
  - `analyze "text"` - Text statistics
  - `uuid [count] [version]` - Generate UUIDs
  - `timestamp` - Current Unix timestamp
  - `jwt "token"` - Decode JWT
  - `info` - Show DevFusion info
  - `clear` - Clear terminal
  - `exit` - Close terminal

- Features:
  - Command history (arrow keys up/down)
  - Real-time command execution
  - Color-coded output (success/error/info/warning)
  - Tab completion ready
  - Keyboard shortcuts

## 📁 File Structure

```
DevFusion/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Main styles & layout
│   ├── components.css     # Component-specific styles
│   └── terminal.css       # Terminal interface styles
└── js/
    ├── utils.js           # Utility functions & DevFusionUtils class
    ├── main.js            # Application controller
    ├── diff-viewer.js     # Diff Viewer module
    ├── json-tools.js      # JSON tools module
    ├── regex-tester.js    # Regex Tester module
    ├── string-utils.js    # String & Hash utilities
    ├── text-analyzer.js   # Text Analyzer module
    ├── file-comparator.js # File Comparator module
    ├── color-picker.js    # Color Picker module
    ├── uuid-generator.js  # UUID Generator module
    ├── timestamp-converter.js  # Timestamp Converter module
    ├── jwt-decoder.js     # JWT Decoder module
    └── terminal.js        # Terminal Interface module
```

## 🎨 Features & Technologies

- **Pure Vanilla JavaScript**: No frameworks or build tools required
- **Professional CDN Libraries**:
  - CodeMirror 5.65.2 (Code editing)
  - JSONEditor 9.10.0 (JSON visualization)
  - diff_match_patch (Diff algorithm)
  - CryptoJS 4.1.1 (Cryptographic hashing)
  - UUID 8.3.2 (UUID generation)
  - Font Awesome 6.4.0 (Icons)

- **Fully Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme Toggle**: User preference storage
- **Real-time Processing**: Debounced events for performance
- **Enterprise Grade**:
  - Comprehensive error handling
  - Input validation
  - Optimized algorithms
  - Modular architecture
  - Clean, documented code

## 🚀 Getting Started

### Installation
1. Download all files maintaining the directory structure
2. Ensure internet connection for CDN libraries
3. Open `index.html` in a modern web browser

### Browser Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Usage
1. **Navigation**: Click tool names in top navigation bar
2. **Theme**: Toggle dark/light mode with moon/sun button
3. **Terminal**: Press `Ctrl + ~` or click terminal icon
4. **File Upload**: Drag files or click upload zone
5. **Copy**: Click copy button or use keyboard shortcuts

## 🔧 Developer Information

### Utility Functions (utils.js)
```javascript
// Clipboard operations
DevFusionUtils.copyToClipboard(text)

// File operations
DevFusionUtils.readFile(file)

// Text algorithms
DevFusionUtils.calculateSimilarity(str1, str2)
DevFusionUtils.getEditDistance(s1, s2)

// Color operations
DevFusionUtils.hexToRgb(hex)
DevFusionUtils.rgbToHsl(r, g, b)
DevFusionUtils.getComplementaryColor(hex)
DevFusionUtils.getColorShades(hex, count)

// Encoding/Decoding
DevFusionUtils.base64Encode/Decode(str)
DevFusionUtils.urlEncode/Decode(str)
DevFusionUtils.escapeHtml/unescapeHtml(text)

// UUID & JWT
DevFusionUtils.generateUUID(version)
DevFusionUtils.parseJWT(token)

// JSON operations
DevFusionUtils.validateJSON(jsonString)
DevFusionUtils.formatJSON(jsonString, indent)
DevFusionUtils.compareJSONObjects(obj1, obj2, path)

// Performance
DevFusionUtils.debounce(func, delay)
DevFusionUtils.throttle(func, delay)
```

### Module Architecture
Each tool is a separate module with its own class:
- `DiffViewerModule`
- `JSONToolsModule`
- `RegexTesterModule`
- `StringUtilsModule`
- `TextAnalyzerModule`
- `FileComparatorModule`
- `ColorPickerModule`
- `UUIDGeneratorModule`
- `TimestampConverterModule`
- `JWTDecoderModule`
- `TerminalModule`

## 💻 Performance Optimization

- **Debounced Events**: Real-time processing without lag
- **Lazy Loading**: Modules initialize on demand
- **Memory Efficient**: In-memory storage (no localStorage)
- **Algorithm Selection**: Myers diff for optimal performance
- **CSS Grid Layout**: Modern responsive layout
- **Font Awesome Icons**: Lightweight SVG icons

## 🔒 Security Considerations

- All processing done client-side (no server transmission)
- XSS protection with HTML escaping
- Input validation on all operations
- No external API calls required
- JWT decoding (not verification - requires secret key)

## 📝 License

DevFusion is provided as-is for personal and commercial use.

## 🤝 Contributing

To add new tools:
1. Create new module file in `js/` folder
2. Add UI in `index.html`
3. Add styles in `styles/components.css`
4. Follow existing module patterns
5. Initialize in `main.js`

## 🐛 Troubleshooting

**Issue**: CDN libraries not loading
- **Solution**: Check internet connection, verify CDN URLs

**Issue**: File upload not working
- **Solution**: Check file size, ensure correct file format

**Issue**: Terminal commands not executing
- **Solution**: Check syntax with `help` command, verify quotes

**Issue**: Performance issues with large files
- **Solution**: Use Compare mode for better performance, limit file size

## 📧 Support

For issues or suggestions, review the code and customize as needed.

---

**DevFusion v2.1.0**
Built with attention to performance, usability, and functionality.
