// Auto-authentication script for protected routes
// This script automatically includes JWT tokens in requests to protected routes

(function() {
    'use strict';

    // Function to get JWT token from localStorage
    function getJWT() {
        return localStorage.getItem('jwt_token');
    }

    // Function to check if token is expired
    function isTokenExpired(token) {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            return payload.exp && payload.exp < now;
        } catch (e) {
            return true;
        }
    }

    // Function to clear all tokens aggressively
    function clearAllTokens() {
        // Clear localStorage
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('token');
        
        // Clear all possible cookie variations
        const cookiesToClear = ['token', 'jwt_token', 'auth_token'];
        cookiesToClear.forEach(cookieName => {
            document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            document.cookie = `${cookieName}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });
        
        console.log('All tokens cleared aggressively');
    }

    // Function to check if user is on a protected route
    function isOnProtectedRoute() {
        const path = window.location.pathname;
        const protectedPaths = ['/admin/', '/order/checkout', '/order/place', '/order/my-orders', '/order/view/'];
        return protectedPaths.some(protectedPath => path.includes(protectedPath));
    }

    // Function to check for expired tokens and clear them
    function validateTokens() {
        const token = getJWT();
        
        // If no token and on protected route, redirect to login
        if (!token && isOnProtectedRoute()) {
            console.log('No token found on protected route, redirecting to login');
            window.location.href = '/auth/login';
            return false;
        }
        
        if (token && isTokenExpired(token)) {
            console.log('Token expired, clearing and redirecting...');
            clearAllTokens();
            if (isOnProtectedRoute()) {
                window.location.href = '/auth/login';
            }
            return false;
        }
        
        return !!token;
    }

    // Auto-set token cookie if it exists in localStorage but not in cookies
    function syncTokenToCookie() {
        const token = getJWT();
        if (token && !isTokenExpired(token)) {
            // Check if cookie already exists
            const cookies = document.cookie.split(';');
            const hasTokenCookie = cookies.some(cookie => cookie.trim().startsWith('token='));
            
            if (!hasTokenCookie) {
                document.cookie = `token=${token}; path=/; SameSite=Lax`;
                console.log('JWT token synced from localStorage to cookie');
            }
        } else if (token && isTokenExpired(token)) {
            // Token exists but is expired, clear it
            clearAllTokens();
        }
    }

    // Function to handle logout completely
    function performLogout() {
        clearAllTokens();
        
        // Make a request to server logout endpoint to ensure server-side cleanup
        fetch('/auth/logout', {
            method: 'GET',
            credentials: 'include'
        }).then(() => {
            // Force redirect to home page
            window.location.href = '/';
        }).catch(() => {
            // Even if server request fails, still redirect
            window.location.href = '/';
        });
    }

    // Intercept clicks on links to protected routes
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Check if this is a logout link
        if (href.includes('/auth/logout') || href.includes('/logout')) {
            e.preventDefault();
            performLogout();
            return;
        }

        // Check if this is a protected route
        const protectedRoutes = ['/admin/', '/order/checkout', '/order/place', '/order/my-orders'];
        const isProtectedRoute = protectedRoutes.some(route => href.includes(route));

        if (isProtectedRoute) {
            e.preventDefault();
            
            // Validate token before proceeding
            if (validateTokens()) {
                const token = getJWT();
                // Set the token as a cookie before navigation
                document.cookie = `token=${token}; path=/; SameSite=Lax`;
                // Small delay to ensure cookie is set
                setTimeout(() => {
                    window.location.href = href;
                }, 10);
            } else {
                window.location.href = '/auth/login';
            }
        }
    });

    // Check tokens on page load and periodically
    function initTokenManagement() {
        validateTokens();
        syncTokenToCookie();
        
        // Check tokens every 10 seconds (more frequent)
        setInterval(validateTokens, 10000);
    }

    // Handle browser back/forward navigation
    window.addEventListener('popstate', function() {
        setTimeout(validateTokens, 100);
    });

    // Handle page visibility change (user comes back to tab)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            validateTokens();
        }
    });

    // Run on page load
    document.addEventListener('DOMContentLoaded', initTokenManagement);
    
    // Also run immediately in case DOMContentLoaded already fired
    if (document.readyState === 'loading') {
        // Still loading
    } else {
        // Already loaded
        initTokenManagement();
    }

    // Expose functions globally for debugging/testing
    window.clearAllTokens = clearAllTokens;
    window.validateTokens = validateTokens;
    window.syncTokenToCookie = syncTokenToCookie;
    window.performLogout = performLogout;

})();