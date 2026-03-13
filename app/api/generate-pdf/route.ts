import { NextRequest, NextResponse } from 'next/server';
import { processImage, generateAdaptivePDF } from '@/lib/processor';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No images uploaded' }, { status: 400 });
    }

    if (files.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 images allowed' }, { status: 400 });
    }

    // Process all images concurrently with initial scanning settings
    const processedImages = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return await processImage(buffer, {
          grayscale: true,
          contrast: 1.3, // Enhance scan look
          height: 1200,   // Standard optimization height
          quality: 85,    // Start high
        });
      })
    );

    // Generate PDF with adaptive compression to hit target < 200 KB
    const { pdfBuffer, sizeKB } = await generateAdaptivePDF(processedImages, 200);

    console.log(`Generated PDF size: ${sizeKB.toFixed(2)} KB, Buffer length: ${pdfBuffer.length}`);

    // Return the PDF buffer and the file size header
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length.toString(),
        'X-File-Size-KB': sizeKB.toFixed(2),
        'Content-Disposition': 'attachment; filename="nanopdf-200kb.pdf"',
      },
      status: 200,
    });
  } catch (err: any) {
    console.error('PDF Generation Error:', err);
    return NextResponse.json({ error: 'Failed to process images: ' + err.message }, { status: 500 });
  }
}
