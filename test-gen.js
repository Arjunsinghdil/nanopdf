const { generateAdaptivePDF, processImage } = require('./lib/processor');
const fs = require('fs');

async function test() {
    try {
        const imgBuffer = fs.readFileSync('test-image.jpg');
        console.log("Input image size:", imgBuffer.length);
        
        const processed = await processImage(imgBuffer);
        console.log("Processed image size:", processed.length);
        
        const { pdfBuffer, sizeKB } = await generateAdaptivePDF([processed], 200);
        console.log("PDF generated. Size:", sizeKB.toFixed(2), "KB");
        
        fs.writeFileSync('test-output.pdf', pdfBuffer);
        console.log("Saved test-output.pdf");
    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
