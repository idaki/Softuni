// utils.js
// Function to retrieve the CSRF token from cookies
export function getCsrfToken() {
    const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    console.log('CSRF Token:', csrfToken); // Log the CSRF token
    return csrfToken;
}

// Function to get the JWT token from localStorage
export function getJwtToken() {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData?.accessToken || '';
}

// Enhanced fetch function with CSRF token handling for secure API interactions
export async function fetchWithSettings(url, options) {
    const csrfToken = getCsrfToken();
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getJwtToken()}`
    };

    // Include CSRF token for state-changing methods (POST, PUT, DELETE, PATCH)
    const methodsRequiringCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'];
    if (methodsRequiringCsrf.includes(options.method)) {
        defaultHeaders['X-XSRF-TOKEN'] = csrfToken;
    }

    console.log('Request URL:', url);
    console.log('Request Headers:', defaultHeaders);
    console.log('Request Options:', options);

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            credentials: 'include'  // Ensure credentials are included with every request
        });

        const isJsonResponse = response.headers.get('Content-Type')?.includes('application/json');
        const responseBody = isJsonResponse ? await response.json() : await response.text();

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response body:', responseBody);
            // Construct an error object and throw it
            const errorBody = typeof responseBody === 'object' ? responseBody : { message: responseBody };
            throw new Error(errorBody.message || 'Network response was not ok');
        }

        console.log('Response body:', responseBody);
        return responseBody;
    } catch (error) {
        console.error("Fetch failed:", error);
        throw error;
    }
}
