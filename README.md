# Quantio

A modern calculator and unit converter web application built with vanilla JavaScript and Material Design 3 principles.

## Features

### Calculator
- Basic arithmetic operations: addition, subtraction, multiplication, division
- Percentage calculations
- Sign toggle (positive/negative)
- Real-time expression display
- Error handling for division by zero

### Converter *(Coming Soon)*
- Length conversion
- Mass/Weight conversion
- Temperature conversion
- Volume conversion
- Time conversion

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid
- **JavaScript (ES6+)** - Modules, modern syntax
- **Material Design 3** - Design system and theming

## Project Structure

```
quantio/
├── css/
│   ├── base.css          # Base styles and typography
│   ├── calculator.css    # Calculator component styles
│   ├── converter.css     # Converter component styles
│   ├── tabs.css          # Tabs component styles
│   └── themes/           # Theme variants
│       ├── theme-light.css
│       ├── theme-light-mc.css
│       ├── theme-light-hc.css
│       ├── theme-dark.css
│       ├── theme-dark-mc.css
│       └── theme-dark-hc.css
├── js/
│   ├── main.js           # Application entry point
│   └── components/
│       ├── calculator.js # Calculator logic
│       └── tabs.js       # Tabs navigation
└── index.html            # Main HTML file
```

## Theming

Quantio supports 6 theme variants following Material Design 3 guidelines:

| Theme | Description |
|-------|-------------|
| `theme-light.css` | Light theme (default) |
| `theme-light-mc.css` | Light theme - Medium Contrast |
| `theme-light-hc.css` | Light theme - High Contrast |
| `theme-dark.css` | Dark theme |
| `theme-dark-mc.css` | Dark theme - Medium Contrast |
| `theme-dark-hc.css` | Dark theme - High Contrast |

To change the theme, update the theme stylesheet link in `index.html`:

```html
<link rel="stylesheet" href="css/themes/theme-dark.css">
```

## Getting Started

1. Clone the repository
2. Open `index.html` in a modern web browser
3. No build process required - it's vanilla HTML/CSS/JS!

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License

