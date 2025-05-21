const cookie = require('cookie');

exports.handler = async (event, context) => {
  // Clear the auth cookie
  const emptyCookie = cookie.serialize('auth_session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 0,
    path: '/'
  });

  // Redirect back to the homepage
  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': emptyCookie,
      'Location': '/',
      'Cache-Control': 'no-cache'
    },
    body: ''
  };
};
