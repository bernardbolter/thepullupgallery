// app/api/locations/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface PostData {
  title: FormDataEntryValue;
  content: FormDataEntryValue;
  status: string;
  author: number;
  acf: {
    lat: FormDataEntryValue;
    lng: FormDataEntryValue;
  };
  featured_media?: number; // The '?' makes it optional
}

export async function GET() {
  try {
    const response = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/pulluplocations`, {
      headers: {
        // Add any necessary headers
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

// Handle new location submissions
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const formData = await request.formData();
    
    // Check if all required fields are provided
    const title = formData.get('title');
    const description = formData.get('description');
    const latitude = formData.get('latitude');
    const longitude = formData.get('longitude');
    const userId = formData.get('userId');
    const imageFile = formData.get('image') as File | null;
    
    if (!title || !latitude || !longitude || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create Basic Auth credentials
    const username = process.env.WP_APP_USERNAME;
    const password = process.env.WP_APP_PASSWORD;
    
    if (!username || !password) {
      console.error('WordPress credentials not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Create Basic Auth header
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    
    // If there's an image, we need to upload it first
    let mediaId = null;
    if (imageFile) {
      // Upload the media file
      const mediaFormData = new FormData();
      mediaFormData.append('file', imageFile);
      
      const mediaResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
        body: mediaFormData,
      });
      
      if (!mediaResponse.ok) {
        console.error('Failed to upload media:', await mediaResponse.text());
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
      
      // Get the media ID
      const mediaData = await mediaResponse.json();
      mediaId = mediaData.id;
    }
    
    // Create the post with all fields in a single request
    const postData = {
      title,
      content: description || '',
      status: 'pending',
      author: Number(userId),
      acf: {
        lat: latitude,
        lng: longitude
      },
      featured_media: Number(mediaId)
    };
    
    // Create the post
    const response = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/pulluplocations`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('WordPress API error:', errorData);
      throw new Error('Failed to submit location');
    }
    
    const locationData = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Location submitted successfully',
      location: locationData
    });
  } catch (error) {
    console.error('Error submitting location:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit location',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}