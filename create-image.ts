import sharp from 'sharp';
import fs from 'fs';

async function createTestImage() {
    await sharp({
        create: {
            width: 100,
            height: 100,
            channels: 3,
            background: { r: 255, g: 0, b: 0 }
        }
    })
    .jpeg()
    .toFile('test-image.jpg');
    console.log("Created test-image.jpg");
}

createTestImage();
