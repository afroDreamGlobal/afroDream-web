import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { isCloudinaryConfigured } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file format. Please upload JPG, PNG, or WEBP.' },
        { status: 400 }
      );
    }

    // Maximum 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    if (isCloudinaryConfigured) {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      // Convert buffer to base64 data URI
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Calculate signed timestamp and signature
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folder = 'afrodreamglobal';

      // Cloudinary signing algorithm: sort parameters alphabetically, append API secret, hash with SHA-1
      const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', base64Data);
      cloudinaryFormData.append('api_key', apiKey!);
      cloudinaryFormData.append('timestamp', timestamp.toString());
      cloudinaryFormData.append('folder', folder);
      cloudinaryFormData.append('signature', signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: cloudinaryFormData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Cloudinary upload failed');
      }

      return NextResponse.json({
        success: true,
        data: {
          secure_url: json.secure_url,
          public_id: json.public_id,
          width: json.width,
          height: json.height,
        },
      });
    }

    // Fallback: If Cloudinary credentials are not configured
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mockUrl = `data:${file.type};base64,${buffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      data: {
        secure_url: mockUrl,
        public_id: `local-${Date.now()}`,
        width: 800,
        height: 600,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
