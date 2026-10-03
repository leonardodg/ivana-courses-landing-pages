#!/bin/bash
# Script para converter MOV para MP4 para compatibilidade com Chrome
# Execute: bash convert-video.sh

INPUT_FILE="public/videos/home.mov"
OUTPUT_FILE="public/videos/home.mp4"

if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Arquivo $INPUT_FILE não encontrado"
    exit 1
fi

if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg não está instalado"
    echo "   Para converter o vídeo, instale ffmpeg:"
    echo "   - macOS: brew install ffmpeg"
    echo "   - Ubuntu/Debian: sudo apt-get install ffmpeg"
    echo "   - Windows: https://ffmpeg.org/download.html"
    exit 1
fi

echo "🔄 Convertendo $INPUT_FILE para $OUTPUT_FILE..."
ffmpeg -i "$INPUT_FILE" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k "$OUTPUT_FILE"

if [ -f "$OUTPUT_FILE" ]; then
    echo "✅ Conversão concluída com sucesso!"
    echo "   Arquivo gerado: $OUTPUT_FILE"
else
    echo "❌ Erro ao converter o vídeo"
    exit 1
fi
