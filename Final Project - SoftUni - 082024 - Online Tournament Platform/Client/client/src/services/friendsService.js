import { getJwtToken, getCsrfToken } from '../utils/utils';
import { BASE_URL } from '../config/config';

export const getAll = async () => {
  try {let csrfToken = getCsrfToken();
    console.log(csrfToken);
if (!csrfToken) {
  csrfToken = await fetchCsrfToken();}
    const response = await fetch(`${BASE_URL}/friends`, {
      method: 'POST', // Ensure the API requires POST for fetching data
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getJwtToken()}`,
        'X-XSRF-TOKEN': getCsrfToken() // Include CSRF token in the headers
      },
      credentials: 'include'
    });

    if (!response) {
      throw new Error('No response from server');
    }

    console.log('Response received:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const contentType = response.headers.get('Content-Type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      console.error('Unexpected response format:', textData);
      throw new Error('Unexpected response format');
    }

    console.log('Fetched friends data:', data); // Log the fetched friends data

    // Check if the data is an array and contains objects with expected keys
    if (!Array.isArray(data) || data.some(item => typeof item !== 'object' || !item.id)) {
      console.error('Expected data to be an array of objects but received:', data);
      throw new Error('Invalid data format from server');
    }

    sessionStorage.setItem('friendsList', JSON.stringify(data));
    return data; // Assume data is an array of FriendDTOs
  } catch (error) {
    console.error('Failed to fetch friends:', error);
    throw error;
  }
};
