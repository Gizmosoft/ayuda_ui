export const saveUserToSessionStorage = (userObject) => {
    console.log('SessionHandler: Saving user to session storage:', userObject);
    // Extract and store only the JWT token
    const { access_token, token_type } = userObject;
    
    // Store token separately for easy access
    if (access_token) {
        sessionStorage.setItem('access_token', access_token);
        sessionStorage.setItem('token_type', token_type || 'bearer');
        console.log('SessionHandler: Token saved to session storage');
    }
};

export const loadUserFromSessionStorage = () => {
    console.log('SessionHandler: Loading user from session storage');
    // User data is no longer stored in session storage
    // It should be fetched from the API when needed
    return null;
};

export const getAuthToken = () => {
    const token = sessionStorage.getItem('access_token');
    console.log('SessionHandler: Getting auth token:', token ? 'found' : 'not found');
    return token;
};

export const getTokenType = () => {
    const tokenType = sessionStorage.getItem('token_type') || 'bearer';
    console.log('SessionHandler: Getting token type:', tokenType);
    return tokenType;
};

export const getAuthHeader = () => {
    const token = getAuthToken();
    const tokenType = getTokenType();
    const header = token ? `${tokenType} ${token}` : null;
    console.log('SessionHandler: Getting auth header:', header ? 'found' : 'not found');
    return header;
};

export const removeUserFromSession = () => {
    console.log('SessionHandler: Removing user from session storage');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('token_type');
};

export const isAuthenticated = () => {
    const authenticated = !!getAuthToken();
    console.log('SessionHandler: Checking authentication:', authenticated);
    return authenticated;
};