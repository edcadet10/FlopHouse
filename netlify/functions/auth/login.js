const { AuthenticationClient } = require('auth0');

exports.handler = async (event, context) => {
  // Redirect to Auth0 login
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL.replace('https://', '');
  const auth0ClientId = process.env.AUTH0_CLIENT_ID;
  const redirectUri = process.env.AUTH0_BASE_URL + '/.netlify/functions/auth/callback';
  
  const loginUrl = `https://${auth0Domain}/authorize?` +
    `response_type=code&` +
    `client_id=${auth0ClientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=openid%20profile%20email`;

  return {
    statusCode: 302,
    headers: {
      Location: loginUrl,
      'Cache-Control': 'no-cache'
    },
    body: ''
  };
};
