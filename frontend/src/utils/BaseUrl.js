export default function getBaseUrl() {
    console.log('BaseUrl: Getting base URL');
    // Use proxy approach to avoid CORS issues
    const baseURL = "/";
    // const baseURL = "http://localhost:8000/";
    // const baseURL = "https://rnnhk-2601-19b-f00-b7a0-edd1-cf5a-9aa2-2dae.a.free.pinggy.link/api/v1";
    console.log('BaseUrl: Using base URL:', baseURL);
    return baseURL;
}