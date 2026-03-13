# TR Smart PDF Generator

A lightweight, high-performance web tool designed specifically for **automobile dealerships** that need to upload stamped documents to government transport portals.

## 🚀 Key Features

- **One-Step Conversion**: Convert document photos (JPG, PNG) into a single optimized PDF below **200 KB**.
- **Intelligent Scanning**: Auto-correct contrast, grayscale, and sharpening for a clean 'CamScanner' look.
- **Adaptive Compression**: Automatically shrinks file size incrementally until it fits the portal limit.
- **Privacy First**: Files are processed entirely in memory and never stored permanently.
- **Ultra Fast**: Total processing time under 3 seconds.

## 🛠️ Technology Stack

- **Frontend**: Next.js, TailwindCSS, Framer Motion, React Dropzone.
- **Backend**: Node.js API with `sharp` (high-performance image processing) and `pdf-lib`.

## 📦 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚢 Deployment

Ready for easy deployment on **Vercel** or any Node.js server. Use `npm run build` to generate the production bundle.

---
Designed for simplicity and speed. Faster than ILovePDF.
