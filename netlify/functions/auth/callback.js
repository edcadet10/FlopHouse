const { AuthenticationClient } = require('auth0');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  try {
    // Get the code from the query string
    const { code } = event.queryStringParameters;
    
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing code parameter' })
      };
    }

    // Exchange the code for a token
    const auth0 = new AuthenticationClient({
      domain: process.env.AUTH0_ISSUER_BASE_URL.replace('https://', ''),
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET
    });

    const redirectUri = process.env.AUTH0_BASE_URL + '/.netlify/functions/auth/callback';
    
    // Exchange the authorization code for tokens
    const authResult = await auth0.oauth.authorizationCodeGrant({
      code,
      redirect_uri: redirectUri
    });

    // Get user info
    const userInfo = jwt.decode(authResult.id_token);

    // Set a session cookie
    const sessionCookie = cookie.serialize('auth_session', authResult.id_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });

    // Redirect back to the app
    return {
      statusCode: 302,
      headers: {
        'Set-Cookie': sessionCookie,
        'Location': '/',
        'Cache-Control': 'no-cache'
      },
      body: ''
    };
  } catch (error) {
    console.error('Auth0 callback error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed' })
    };
  }
};
