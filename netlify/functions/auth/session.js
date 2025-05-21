const cookie = require('cookie');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  try {
    // Get the session cookie
    const cookies = cookie.parse(event.headers.cookie || '');
    const sessionToken = cookies.auth_session;

    if (!sessionToken) {
      return {
        statusCode: 401,
        body: JSON.stringify({ authenticated: false })
      };
    }

    // Verify and decode the token
    try {
      const userInfo = jwt.decode(sessionToken);
      
      // Session is valid
      return {
        statusCode: 200,
        body: JSON.stringify({
          authenticated: true,
          user: {
            sub: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture
          }
        })
      };
    } catch (error) {
      console.error('Token verification error:', error);
      
      // Session is invalid
      return {
        statusCode: 401,
        body: JSON.stringify({ authenticated: false, error: 'Invalid session' })
      };
    }
  } catch (error) {
    console.error('Session error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ authenticated: false, error: 'Internal server error' })
    };
  }
};
