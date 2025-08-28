// Simple test script to verify authentication
const testAuth = async () => {
  try {
    // Simulate a login request
    const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    
    const data = await response.json();
    console.log('Auth test response:', data);
  } catch (error) {
    console.error('Auth test error:', error);
  }
};

testAuth();