import { jwtDecode } from "jwt-decode";
import {isJsonResponse} from '../utils/errorsUtil';

export function getJwtToken() {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData?.accessToken || '';
}

// Utility to store authentication data in localStorage
export const storeAuthData = (token) => {
  const decoded = jwtDecode(token);
  console.log('Decoded token:', decoded);

  const authData = {
    accessToken: token,
    roles: decoded.roles || [], // Ensure roles is always an array
    expiresAt: decoded.exp * 1000, // Convert to milliseconds
  };

  // Save auth data to localStorage
  localStorage.setItem('authData', JSON.stringify(authData));

  return authData;
};
export const getCsrfToken = () => {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    if (match) {
      return match[2];
    }
    return null;
  };


export function fetchCsrfToken() {
    const token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const header = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
    return { token, header };
}

export function getCsrfTokenFromMeta() {
    const token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const header = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
    return { token, header };
}
export async function fetchWithSettings(url, options) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getJwtToken()}`,
        'X-XSRF-TOKEN': getCsrfToken()
    };

    const mergedOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        },
        credentials: 'include'
    };

    console.log('Making request to:', url);
    console.log('Request method:', mergedOptions.method);
    console.log('Request headers:', mergedOptions.headers);
    if (mergedOptions.body) {
        console.log('Request body:', mergedOptions.body);
    }

    try {
        const response = await fetch(url, mergedOptions);

        if (!response.ok) {
            const isJsonResponse = response.headers.get('Content-Type')?.includes('application/json');
            const responseBody = isJsonResponse ? await response.json() : await response.text();
            // Directly throw the error message from the server response
            const errorMessage = responseBody.message || responseBody;
            throw new Error(errorMessage);
        }

        const isJsonResponse = response.headers.get('Content-Type')?.includes('application/json');
        return isJsonResponse ? await response.json() : await response.text();
    } catch (error) {
        console.error("Fetch failed:", error);
        throw error;
    }
}


  
  
// Function to set CSRF token in meta tags
export const setCsrfTokenInMetaTags = (token) => {
    let csrfMetaTag = document.querySelector('meta[name="_csrf"]');
    if (!csrfMetaTag) {
        csrfMetaTag = document.createElement('meta');
        csrfMetaTag.name = '_csrf';
        document.head.appendChild(csrfMetaTag);
    }
    csrfMetaTag.content = token;

    let csrfHeaderMetaTag = document.querySelector('meta[name="_csrf_header"]');
    if (!csrfHeaderMetaTag) {
        csrfHeaderMetaTag = document.createElement('meta');
        csrfHeaderMetaTag.name = '_csrf_header';
        document.head.appendChild(csrfHeaderMetaTag);
    }
    csrfHeaderMetaTag.content = 'X-CSRF-TOKEN';
};

