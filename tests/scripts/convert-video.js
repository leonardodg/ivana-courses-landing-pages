import { FFmpeg, toBlobURL } from '@ffmpeg/ffmpeg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function convertVideo() {
  const ffmpeg = new FFmpeg();
  const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm';
  
  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    const inputPath = path.join(__dirname, 'public/videos/home.mov');
    const outputPath = path.join(__dirname, 'public/videos/home.mp4');

    const inputData = fs.readFileSync(inputPath);
    ffmpeg.writeFile('input.mov', inputData);

    await ffmpeg.exec(['-i', 'input.mov', '-c:v', 'libx264', '-preset', 'fast', '-c:a', 'aac', 'output.mp4']);

    const outputData = ffmpeg.readFile('output.mp4');
    fs.writeFileSync(outputPath, Buffer.from(outputData));

    console.log('✓ Video converted successfully to MP4');
    process.exit(0);
  } catch (error) {
    console.error('Error converting video:', error);
    process.exit(1);
  }
}

convertVideo();
