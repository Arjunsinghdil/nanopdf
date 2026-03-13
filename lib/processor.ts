import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

/**
 * Optimizes an image for document scanning.
 * Grayscale, High Contrast, Resize, and Quality compression.
 */
export async function processImage(
  buffer: Buffer,
  options: {
    grayscale?: boolean;
    contrast?: number;
    height?: number;
    quality?: number;
  } = {}
) {
  const { grayscale = true, contrast = 1.2, height = 1200, quality = 80 } = options;

  let image = sharp(buffer);

  // Auto rotate based on EXIF
  image = image.rotate();

  // Resize (max height 1200 as requested, aspect ratio preserved)
  image = image.resize({ height, withoutEnlargement: true });

  if (grayscale) {
    image = image.grayscale();
  }

  // Increase contrast and brightness (Scan effect)
  // High contrast and threshold for that 'ink-on-paper' scan feel
  image = image.linear(1.5, -(128 * (1.5 - 1))); // Increased contrast multiplier

  // Sharpen for better text readability
  image = image.sharpen();

  // Optionally use threshold for ultra-clean look (removes faint shadows)
  // image = image.threshold(180); 

  // Output as JPEG with specific quality
  return await image.jpeg({ 
    quality, 
    mozjpeg: true,
    optimiseScans: true,
    progressive: true 
  }).toBuffer();
}

/**
 * Generates a PDF from a list of optimized image buffers.
 * Implements adaptive compression to stay under 200 KB.
 */
export async function generateAdaptivePDF(
  imageBuffers: Buffer[],
  targetSizeKB: number = 200
): Promise<{ pdfBuffer: Uint8Array; sizeKB: number }> {
  let currentQuality = 80;
  let currentHeight = 1200;
  let finalPdfBuffer: Uint8Array | null = null;
  let currentSizeKB = 0;

  // Max 6 iterations to avoid slow processing
  for (let i = 0; i < 6; i++) {
    const pdfDoc = await PDFDocument.create();

    // Re-process images with current quality and height
    const processedImages = await Promise.all(
      imageBuffers.map(async (buf) => {
        // Only re-process if i > 0
        if (i === 0) return buf;
        
        return await sharp(buf)
          .resize({ height: currentHeight, withoutEnlargement: true })
          .jpeg({ quality: currentQuality })
          .toBuffer();
      })
    );

    for (const imgBuffer of processedImages) {
      const img = await pdfDoc.embedJpg(imgBuffer);
      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    finalPdfBuffer = pdfBytes;
    currentSizeKB = finalPdfBuffer.length / 1024;

    if (currentSizeKB <= targetSizeKB) {
      break;
    }

    // Reduce quality first, then resolution
    if (currentQuality > 40) {
      currentQuality -= 20;
    } else {
      currentHeight = Math.floor(currentHeight * 0.8);
      currentQuality = 40; // Keep quality decent while reducing resolution
    }
    
    if (currentHeight < 400) break; // Don't go too small
  }

  return {
    pdfBuffer: finalPdfBuffer!,
    sizeKB: currentSizeKB,
  };
}
