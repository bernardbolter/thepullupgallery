// app/api/auth/register/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server';

// WordPress API URL from environment variables
const WP_API_URL = process.env.WORDPRESS_URL;

// Define types for request body
interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, firstName, lastName }: RegisterRequestBody = body;

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Step 1: Register the 
    console.log(process.env.WORDPRESS_URL)
    console.log(process.env.WORDPRESS_USERNAME)
    console.log(process.env.WORDPRESS_PASSWORD)

    const registrationResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/auth/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password: password,
        firstName: firstName?.trim() || '',
        lastName: lastName?.trim() || ''
      })
    });

    const registrationData = await registrationResponse.json();
    console.log(registrationResponse.json)

    if (!registrationResponse.ok) {
      console.log("user not registered")
      return NextResponse.json(
        {
          message: 'Registration failed',
          error: registrationData
        },
        { status: registrationResponse.status }
      );
    }

    console.log("user is registered")
    // Step 2: Authenticate the newly created user
    const authResponse = await authenticateUser(username, password);
    
    if (authResponse.success) {
      // Create response with user data
      const response = NextResponse.json(
        {
          message: 'User registered and authenticated successfully',
          user: authResponse.user // Use the complete user object from authResponse
        },
        { status: 201 }
      );
      
      // Set authentication cookie on the response
      response.cookies.set({
        name: 'wp_token',
        value: authResponse.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      
      return response;
    } else {
      return NextResponse.json(
        {
          message: 'User registered but authentication failed',
          user: {
            id: registrationData.id,
            username: registrationData.username,
            email: registrationData.email
          }
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: errorMessage
      },
      { status: 500 }
    );
  }
}

// Helper function to authenticate user
async function authenticateUser(username: string, password: string) {
  try {
    // Option 1: Using JWT Authentication plugin
    const jwtResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (jwtResponse.ok) {
      const jwtData = await jwtResponse.json();
      
      // Fetch complete user data using the token
      const userResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/users/me?context=edit`, {
        headers: {
          'Authorization': `Bearer ${jwtData.token}`,
        },
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        
        return {
          success: true,
          token: jwtData.token,
          user: {
            id: userData.id,
            username: userData.username,
            name: userData.name,
            email: userData.email,
            roles: userData.roles || ['subscriber'], // Ensure roles is always defined
            avatar: userData.avatar_urls?.[96] || null,
          }
        };
      }
      
      // Fallback if user data fetch fails
      return {
        success: true,
        token: jwtData.token,
        user: {
          id: jwtData.user_id || 0,
          username: username,
          name: jwtData.user_display_name || username,
          email: '',
          roles: ['subscriber'], // Default role
          avatar: null,
        }
      };
    }

    // Option 2: Using Application Passwords (WordPress 5.6+)
    const basicAuthResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
      }
    });

    if (basicAuthResponse.ok) {
      const userData = await basicAuthResponse.json();
      return {
        success: true,
        token: Buffer.from(`${username}:${password}`).toString('base64'),
        user: userData
      };
    }

    return { success: false };

  } catch (error: unknown) {
    console.error('Authentication error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

// Login endpoint - app/api/auth/login/route.js
export async function loginHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const authResult = await authenticateUser(username, password);
    
    if (authResult.success) {
      return NextResponse.json(
        {
          message: 'Authentication successful',
          token: authResult.token,
          user: authResult.user
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: errorMessage
      },
      { status: 500 }
    );
  }
}

// Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}