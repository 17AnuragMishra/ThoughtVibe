import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    MONGO_CONNECTION_URL: process.env.MONGO_CONNECTION_URL ? 'Set' : 'Not set',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set',
  };

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    envVars,
    timestamp: new Date().toISOString()
  });
} 