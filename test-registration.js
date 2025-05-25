// Simple test script for registration functionality
// Using built-in fetch API

// Test user data - change these values for each test
const testUser = {
  username: 'testuser' + Math.floor(Math.random() * 10000),
  email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
};

console.log('Testing registration with:', {
  username: testUser.username,
  email: testUser.email
});

// Test registration endpoint
async function testRegistration() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      if (data.externalRegistration) {
        console.log('⚠️ Registration via API not available');
        console.log('Message:', data.message);
        console.log('Direct WordPress registration URL:', data.wordpressUrl);
        console.log('\nℹ️ In your app, you should redirect users to this URL to complete registration');
        return null;
      } else if (data.user) {
        console.log('✅ Registration successful!');
        return data;
      } else {
        console.log('⚠️ Unexpected response format');
        return null;
      }
    } else {
      console.log('❌ Registration failed!');
      if (data.wordpressUrl) {
        console.log('Direct WordPress registration URL:', data.wordpressUrl);
      }
      return null;
    }
  } catch (error) {
    console.error('Error during test:', error);
    return null;
  }
}

// Test login endpoint with the same credentials
async function testLogin(credentials) {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      }),
    });

    const data = await response.json();
    
    console.log('\nLogin test:');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed!');
    }
  } catch (error) {
    console.error('Error during login test:', error);
  }
}

// Test WordPress site availability
async function testWordPressSite() {
  try {
    // Get the WordPress URL from the environment variable or use the default
    const wpUrl = process.env.WORDPRESS_URL || 'https://digitalcityseries.com/bolter';
    console.log('Testing WordPress site availability:', wpUrl);
    
    const response = await fetch(`${wpUrl}/wp-json`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      console.log('✅ WordPress site is accessible!');
      const data = await response.json();
      console.log('Site name:', data.name);
      console.log('Site description:', data.description);
      return true;
    } else {
      console.log('❌ WordPress site returned status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error connecting to WordPress site:', error.message);
    return false;
  }
}

// Run the tests
async function runTests() {
  // Skip WordPress site availability check and directly test registration
  console.log('Starting registration test directly...');
  const registrationResult = await testRegistration();
  
  if (registrationResult) {
    await testLogin(testUser);
  }
  
  console.log('\nTest completed!');
}

runTests();
