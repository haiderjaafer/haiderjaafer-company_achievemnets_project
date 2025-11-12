// app/api/media/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get file path from query parameter
    const filePath = request.nextUrl.searchParams.get('file');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Decode the path
    const decodedPath = decodeURIComponent(filePath);

    // Normalize path (handle Windows paths)
    const normalizedPath = path.normalize(decodedPath);

    console.log('Serving file:', normalizedPath);

    // Ensure file exists
    if (!fs.existsSync(normalizedPath)) {
      console.error('File not found:', normalizedPath);
      return NextResponse.json(
        { error: 'File not found: ' + normalizedPath },
        { status: 404 }
      );
    }

    // Check if it's a file (not directory)
    const stats = fs.statSync(normalizedPath);
    if (!stats.isFile()) {
      return NextResponse.json(
        { error: 'Path is not a file' },
        { status: 400 }
      );
    }

    // Read file
    const fileBuffer = fs.readFileSync(normalizedPath);

    // Determine MIME type from extension
    const ext = path.extname(normalizedPath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska',
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { 
        error: 'Failed to serve image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}