import { NextRequest, NextResponse } from 'next/server';

// WordPress API credentials from environment variables
const WP_API_URL = process.env.WORDPRESS_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Call WordPress JWT auth endpoint
    const authResponse = await fetch(`${WP_API_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: authData.message || 'Failed to login' },
        { status: authResponse.status }
      );
    }

    // Get user data
    const userResponse = await fetch(`${WP_API_URL}/wp-json/wp/v2/users/me?context=edit`, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get user data' },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
    
    // Create response with user data
    const response = NextResponse.json({
      user: {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        roles: userData.roles,
        avatar: userData.avatar_urls?.[96] || null,
      }
    });
    
    // Set cookie on the response
    response.cookies.set({
      name: 'wp_token',
      value: authData.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    // Return the response with cookie
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
