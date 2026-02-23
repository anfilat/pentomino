# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pentomino solver implementing Knuth's Dancing Links (Algorithm X) algorithm. It finds all ways to cover an arbitrary area using pentomino pieces (12 distinct shapes, each made of 5 squares). The project has both a CLI version and a web application (PWA).

## Development Commands

### Build
- `npm run build` - Build the web application (production) using Vite
- `npm run dev` - Start development server with hot module replacement
- `npm run preview` - Preview production build locally
- `npm run prepare` - Compile SMUI theme from `src/theme` to `public/smui.css`

### Serve
- `npm start` - Serve the built web application locally (uses sirv-cli)

### Testing
- `npm test` - Run Vitest tests
- Tests are located in `test/` directory
- Vitest configuration: `vitest.config.js` (globals enabled, Node environment)

### CLI Usage
```bash
node cli.js [-a] fileName.json
```
The `-a` flag finds all solutions instead of stopping after the first one.

Input JSON format:
```json
{
  "items": 2,  // number of full pentomino sets, OR object like {"I": 1, "Y": 2, ...}
  "space": [12, 10]  // [height, width] OR 2D array [[0, 1, ...], ...]
}
```

## Architecture

### Core Algorithm (`dlx/`)

The Dancing Links implementation is shared between CLI and web versions:

- **`dlx/pentamino.js`**: `prepareData(items, space)` - Converts items and space into the exact cover problem format. Returns columns, rows, and mirror transformations for eliminating symmetric duplicate solutions.
- **`dlx/solver.js`**: `Solver` class - Implements Algorithm X with backtracking. Key method: `findSolutions(printSolution, stop)`
- **`dlx/scene.js`**: `Scene` class - Manages the dancing links data structure (doubly-linked lists for columns and rows)
- **`dlx/figures.js`**: Figure definitions and `variateFigure()` - generates all rotations/reflections of each pentomino piece
- **`dlx/utils.js`**: Matrix transformation utilities (rotate, mirror)
- **`dlx/errors.js`**: Custom error types for validation

### Shared Code (`common/`)

- **`figures.js`**: Definitions of all 12 pentomino shapes (I, N, L, U, X, W, P, F, Z, T, V, Y) with their matrices and colors
- **`greedyColor.js`**: `assignColors()` - Graph coloring algorithm to assign colors to pieces when duplicates exist
- **`utils.js`**: Shared utilities including `isItemsUnique()`, `fillItems()`, `prepareSpace()`

### CLI Version

- **`cli.js`**: Entry point for command-line solver
- **`cliSrc/index.js`**: CLI orchestration, argument parsing
- **`cliSrc/input.js`**: JSON input file parsing
- **`cliSrc/output.js`**: Console output formatting
- **`cliSrc/utils.js`**: CLI utilities

### Web Application (`src/`)

- **`src/main.js`**: Svelte app entry point
- **`src/App.svelte`**: Main UI component - handles grid display, user input, solver orchestration
- **`src/components/NumberField.svelte`**: Custom number input component using SMUI
- **`src/code/worker.js`**: Web Worker that runs the solver (prevents UI blocking). Imports from `dlx/` directly.
- **`src/code/presets.js`**: Predefined puzzle configurations (Butterfly, Cat, Chess, etc.)
- **`src/code/valueStore.js`**: Svelte store wrapper that only triggers callbacks on value change
- **`src/code/output.js`**: `printSolution()` - formats solver output for web display with color assignment

### Build Configuration

- **`vite.config.js`**: Vite configuration with Svelte plugin
- **`vitest.config.js`**: Vitest test configuration (uses same Vite config for tests)
- Build outputs to `public/build/` directory
- Uses Vite with Svelte plugin and SMUI components
- Hot module replacement in dev mode

## Data Flow

### CLI Version
1. Parse command-line arguments and JSON file
2. `prepareData()` converts items + space → columns + rows
3. `Solver` finds solutions using backtracking
4. Print solutions to console with colors

### Web Version
1. User configures space (grid) and pentomino counts via UI
2. On "Start", spawn Web Worker with `{items, space}`
3. Worker runs `prepareData()` and `Solver`
4. Worker posts back `[solution, error]`
5. UI displays solution with color-coded pieces

## Key Concepts

### Exact Cover Problem
Each pentomino placement is a "row" that covers specific "columns" (grid cells + piece identifiers). The solver selects rows such that each column is covered exactly once.

### Symmetry Handling
The `getMirrors()` function in `pentamino.js` detects which transformations (mirror X/Y, rotate) leave the space unchanged. These transformations are used to eliminate duplicate solutions. For example, a 10x12 rectangle has 8 symmetries, so solutions are filtered accordingly.

### Web Worker Architecture
The solver runs in a separate thread (`worker.js`) to avoid freezing the UI during long computations. The worker is created fresh for each solve operation and terminated when the user clicks "Stop".

## Adding New Presets

Edit `src/code/presets.js` and add to the `presets` array:
```javascript
{
    name: 'My Puzzle',
    items: 1,  // or {"I": 2, "N": 1, ...} for custom piece counts
    space: [height, width]  // or 2D array
}
```

## SMUI Theme

The Material Design theme is compiled from `src/theme/_smui-theme.scss` using `smui-theme compile`. After modifying theme files, run `npm run prepare` to regenerate `public/smui.css`.
