# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-12-22

### Added

#### Calculator

- Basic arithmetic operations (addition, subtraction, multiplication, division)
- Percentage calculations
- Sign toggle (positive/negative)
- Real-time expression display
- Error handling for division by zero
- Keyboard support for all operations
  - Numbers: `0-9`
  - Operators: `+`, `-`, `*` (×), `/` (÷)
  - Equals: `Enter` or `=`
  - Clear: `Escape`, `C`, or `Delete`
  - Backspace: Remove last character
- Dynamic font scaling for long numbers
- Fixed width layout that maintains consistent size
- Character limit validation (prevents display overflow)
- Display limited to maximum 2 lines

#### Converter

- Unit conversion functionality with 5 categories:
  - Length (mm, cm, dm, m, dam, hm, km, in, ft, yd, mi, nmi)
  - Mass/Weight (mg, cg, dg, g, dag, hg, kg, t, oz, lb, st)
  - Temperature (°C, °F, K with special conversion formulas)
  - Volume (ml, cl, dl, L, dal, hl, m³, fl oz, cup, pt, qt, gal)
  - Time (ns, µs, ms, s, min, h, d, wk, mo, yr)
- Real-time conversion as you type
- Input and output fields with unit selectors
- Input validation (8 bytes maximum)
- Readonly output field

#### Theming

- Theme toggle (light/dark)
- Contrast selector (default, medium, high)
- 6 theme variants following Material Design 3
- Theme preferences saved to localStorage
- System color scheme detection

#### UI/UX

- Material Design 3 design system
- Tabs navigation for Calculator and Converter
- Responsive layout
- Accessible interface with proper ARIA labels

### Changed

- Calculator display now uses dynamic font scaling
- Calculator maintains fixed width regardless of input length
- Calculator zero button merged into single wide button
- Theme CSS selectors simplified to use `:root` only

### Fixed

- Calculator vertical overflow prevented
- Calculator display limited to 2 lines maximum
- Calculator keyboard shortcuts no longer interfere with input fields
- Standard `line-clamp` property added for browser compatibility

### Documentation

- Comprehensive JSDoc documentation for all JavaScript files
- CSS documentation with component descriptions
- HTML documentation with section comments
- README with complete feature list and project structure

[Unreleased]: https://github.com/herissonneves/quantio/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/herissonneves/quantio/releases/tag/v1.0.0
