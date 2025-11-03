# 🚢 Battleship Game

A classic naval strategy game built with vanilla JavaScript, featuring single-player and multiplayer modes with an intuitive drag-and-drop ship placement interface.

## 🎮 [Play Live Demo](https://kyungwan2023F.github.io/Battleship/)

## 📋 Features

- **Single Player Mode**: Battle against an intelligent AI opponent
- **Interactive Ship Placement**: Drag-and-drop interface with visual preview
- **Ship Rotation**: Right-click to rotate ships during placement
- **Visual Feedback**: Clear hit/miss indicators with animations
- **Responsive Design**:Ocean-themed UI with animated backgrounds

## 🎯 Game Rules

### Fleet Composition
- 1 × Carrier (5 cells)
- 1 × Battleship (4 cells)
- 1 × Cruiser (3 cells)
- 2 × Destroyers (2 cells each)

### How to Play
1. **Setup Phase**: Place all your ships on the grid
   - Click a ship from the dock to select it
   - Move your mouse over the grid to preview placement
   - Right-click to rotate between horizontal/vertical
   - Click to confirm placement
   - Press ESC to cancel selection

2. **Battle Phase**: Take turns attacking the enemy grid
   - Click any cell on the enemy board to attack
   - ✕ indicates a hit
   - ○ indicates a miss
   - Sink all enemy ships to win!

## 🛠️ Technologies Used

- **JavaScript (ES6+)**: Game logic and DOM manipulation
- **HTML5 & CSS3**: Structure and styling
- **Webpack**: Module bundling and build process
- **Jest**: Unit testing framework
- **Babel**: JavaScript transpilation
- **GitHub Pages**: Deployment and hosting
