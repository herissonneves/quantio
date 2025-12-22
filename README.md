# Quantio

A modern calculator and unit converter web application built with vanilla JavaScript and Material Design 3 principles.

🌐 **Live Demo**: [https://herissonneves.github.io/quantio/](https://herissonneves.github.io/quantio/)

## Features

### Calculator

- Basic arithmetic operations: addition, subtraction, multiplication, division
- Percentage calculations
- Sign toggle (positive/negative)
- Real-time expression display
- Error handling for division by zero
- **Keyboard support**: Use your keyboard to input numbers and operations
  - Numbers: `0-9`
  - Operators: `+`, `-`, `*` (×), `/` (÷)
  - Equals: `Enter` or `=`
  - Clear: `Escape`, `C`, or `Delete`
  - Backspace: Remove last character
- **Dynamic font scaling**: Display automatically adjusts font size for long numbers
- **Fixed width layout**: Calculator maintains consistent size regardless of input length

### Converter

- **5 conversion categories**: Length, Mass/Weight, Temperature, Volume, Time
- **Real-time conversion**: Results update automatically as you type
- **Comprehensive unit support**:
  - **Length**: mm, cm, dm, m, dam, hm, km, in, ft, yd, mi, nmi
  - **Mass**: mg, cg, dg, g, dag, hg, kg, t, oz, lb, st
  - **Temperature**: °C, °F, K (with special conversion formulas)
  - **Volume**: ml, cl, dl, L, dal, hl, m³, fl oz, cup, pt, qt, gal
  - **Time**: ns, µs, ms, s, min, h, d, wk, mo, yr
- **Input validation**: Limits input and output to 8 bytes maximum
- **Material Design 3 outlined fields**: Clean, accessible interface
- **Readonly output**: Result field is protected from manual editing

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
│       ├── converter.js  # Unit converter logic
│       ├── tabs.js       # Tabs navigation
│       └── theme-toggle.js # Theme and contrast selector
└── index.html            # Main HTML file
```

## Theming

Quantio supports 6 theme variants following Material Design 3 guidelines:

| Theme                | Description                   |
| -------------------- | ----------------------------- |
| `theme-light.css`    | Light theme (default)         |
| `theme-light-mc.css` | Light theme - Medium Contrast |
| `theme-light-hc.css` | Light theme - High Contrast   |
| `theme-dark.css`     | Dark theme                    |
| `theme-dark-mc.css`  | Dark theme - Medium Contrast  |
| `theme-dark-hc.css`  | Dark theme - High Contrast    |

### Theme Controls

The application includes built-in theme controls in the header:

- **Theme Toggle**: Switch between light and dark themes
- **Contrast Selector**: Choose between default, medium contrast, and high contrast variants

Your theme and contrast preferences are automatically saved to localStorage and persist across sessions. The app also detects your system's color scheme preference on first visit.

## Getting Started

### Online

Visit the live application at [https://herissonneves.github.io/quantio/](https://herissonneves.github.io/quantio/)

### Local Development

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
