# Sample Banner Image Generation Prompts

Images are 1280 × 640 px social-preview banners displayed in each sample's `README.md` and `docs/index.md`.  
All images share a **modern futuristic** visual language: dark deep-space backgrounds, electric neon-to-violet gradients, holographic glows, and clean geometric UI elements.

---

## 1. Basic Sample

### Prompt

> A futuristic dark hero banner for a developer tool. A minimal React + TypeScript code app interface floats in 3D space against a deep navy background. Glowing violet and cyan code brackets `< />` anchor the left side. On the right, a sleek holographic terminal window shows a `npm run dev` command with neon-green output lines. A faint circuit-board grid overlays the background. A translucent Power Apps logo watermark glows in the top-right corner. Style: modern flat 3D illustration, glassmorphism panels, electric purple-to-cyan gradient, ultra-clean typography. 16:9 widescreen banner format. No people.

### File name

```
basic-sample-social-preview.png
```

### Alt text

```
Basic Sample – Power Apps Code App scaffolded with React, TypeScript, and Vite
```

### Caption

```
Basic Sample — Start here. Scaffold, run locally, and deploy your first Power Apps Code App.
```

### Description (for docs front-matter / meta)

```
A minimal Power Apps Code App built with React, TypeScript, and Vite, demonstrating pac code init, local HMR dev, and pac code push deployment.
```

---

## 2. Dataverse Actions, Functions & Power Automate Flows Samples

### Prompt

> A futuristic dark hero banner for a Power Platform developer sample. Three glowing holographic cards float in 3D space on a deep space-black background with a violet-to-indigo radial gradient. The left card shows a stylised POST HTTP badge with an orange glow labelled "Custom API Action". The centre card shows a GET badge with a cyan glow labelled "Custom API Function". The right card shows a lightning-bolt Power Automate icon in electric blue labelled "Flow Trigger". Fine neon data-flow lines connect the cards to a central Dataverse diamond-shaped icon glowing purple in the middle. Subtle hex-grid overlay. Glassmorphism panel borders. Style: modern flat 3D illustration, futuristic UI, deep-space colour palette (black, violet, cyan, orange). 16:9 widescreen banner. No people.

### File name

```
dataverse-actions-functions-flows-code-apps-social-preview.png
```

### Alt text

```
Dataverse Actions, Functions & Power Automate Flows in Power Apps Code Apps
```

### Caption

```
Dataverse Actions, Functions & Flows — Call Custom API Actions, Custom API Functions, and trigger Power Automate flows from a React Code App.
```

### Description (for docs front-matter / meta)

```
Demonstrates calling unbound Dataverse Custom API Actions (POST), Custom API Functions (GET with OData inline parameters), and triggering Power Automate instant flows via HTTP Request triggers from a Power Apps Code App.
```

---

## 3. IFrame Samples

### Prompt

> A futuristic dark hero banner for a developer integration sample. A large holographic browser window floats at a slight angle on a deep navy background with a teal-to-indigo gradient. Inside the browser window, a secondary glowing iframe panel is embedded — its content shows a stylised map or data visualisation with neon-teal data points. Glowing bidirectional arrows connect the outer app frame to the inner iframe, labelled "postMessage" in tiny neon text. A faint wave-pattern grid overlays the background. Glassmorphism borders with soft teal glow. Style: modern flat 3D illustration, futuristic UI, dark palette (navy, teal, white). 16:9 widescreen banner. No people.

### File name

```
iframe-samples-social-preview.png
```

### Alt text

```
IFrame Samples – Embedding external web content in a Power Apps Code App using iframes
```

### Caption

```
IFrame Samples — Embed external web content and communicate between the host app and embedded pages.
```

### Description (for docs front-matter / meta)

```
Shows how to embed external web content inside a Power Apps Code App using iframes, including postMessage communication patterns between the host app and embedded pages.
```

---

## 4. Localization Samples

### Prompt

> A futuristic dark hero banner for a multilingual developer sample. A central holographic globe with glowing latitude lines floats on a deep space background with a magenta-to-violet gradient. Around the globe, small neon label chips display locale codes: "en-US", "fr-FR", "de-DE", "ja-JP", "ar-SA" in electric white text with coloured halos. A stylised React component tree diagram extends from the bottom, with language-string tokens flowing upward as glowing data packets. Subtle star-field background. Glassmorphism panel borders with magenta glow. Style: modern flat 3D illustration, futuristic UI, dark palette (deep black, magenta, violet, white). 16:9 widescreen banner. No people.

### File name

```
localization-samples-social-preview.png
```

### Alt text

```
Localization Samples – Multi-language support in a Power Apps Code App using Power Apps locale context
```

### Caption

```
Localization Samples — Build multi-language Code Apps using Power Apps locale context and LCID-driven UI rendering.
```

### Description (for docs front-matter / meta)

```
Demonstrates multi-language support in a Power Apps Code App using Power Apps locale context, dynamic string resources, and LCID-driven UI rendering.
```

---

## Usage in Markdown

Place generated images under `assets/` in the repository root and reference them as follows:

```md
![Alt text](../../assets/<file-name>.png)
*Caption text*
```

Or for docs pages with a description meta block:

```md
---
description: "<description>"
---

![Alt text](../../assets/<file-name>.png)
*Caption text*
```
