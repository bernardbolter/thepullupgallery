import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// WordPress API credentials from environment variables
const WP_API_URL = process.env.WORDPRESS_URL;

export async function GET(request: NextRequest) {
  try {
    // Get token from request cookies
    const token = request.cookies.get('wp_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user data from WordPress
    const response = await fetch(`${WP_API_URL}/wp-json/wp/v2/users/me?context=edit`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // If token is invalid, clear it in the response
      if (response.status === 401) {
        const clearResponse = NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
        clearResponse.cookies.delete('wp_token');
        return clearResponse;
      }
      
      return NextResponse.json(
        { error: 'Failed to get user data' },
        { status: response.status }
      );
    }

    const userData = await response.json();

    // Return user data without sensitive information
    return NextResponse.json({
      user: {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        roles: userData.roles,
        avatar: userData.avatar_urls?.[96] || null,
      }
    });
  } catch (error) {
    console.error('Get user data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Create response and clear the auth token cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('wp_token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
