# PPTX Slide Viewer

## Overview
A React-based application that parses `.pptx` files and dynamically renders slides, supporting images, videos, and text.

## Project Structure
```
App.tsx  
 ├── Pagination (Input: Slide Number)  
 │   ├── Slide Renderer (Renders based on Slide Number)  
 │   │   ├── Extracted JSON (Slide-specific data)  
 │   │   │   ├── Slide Factory (Handles Image, Video, Text rendering)  
```

## Components

### 1️⃣ **Pagination**
- Accepts user input for slide number.
- Controls navigation between slides.

### 2️⃣ **Slide Renderer**
- Fetches the extracted JSON for the selected slide.
- Passes data to the Slide Factory for rendering.

### 3️⃣ **Extracted JSON**
- JSON representation of the `.pptx` file.
- Contains structured data about slides and their elements.

### 4️⃣ **Slide Factory**
- Uses extracted JSON to render different media types:
  - **🖼 Images**
  - **🎥 Videos**
  - **📝 Text**

## Workflow
1. User inputs a slide number in the **Pagination** component.
2. The **Slide Renderer** retrieves the corresponding JSON.
3. The **Slide Factory** processes the JSON and renders the appropriate content.

## Technologies Used
- **React**: For UI rendering.
- **TypeScript**: For type safety.
- **pptx-parser**: To parse PowerPoint files into JSON.

## Setup & Usage
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the application:
   ```bash
   npm start
   ```

