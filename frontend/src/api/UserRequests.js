import getBaseUrl from "../utils/BaseUrl";
import axios from "axios";

const baseUrl = getBaseUrl();

export const getUserByEmailId = async (emailId) => {
  try {
    const response = await axios.get(`${baseUrl}/users/email/${emailId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch user data');
  }
};

export const updateUserSkills = async (emailId, skills) => {
  try {
    const response = await axios.put(`${baseUrl}/users/${emailId}/skills`, { skills });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update skills');
  }
};

export const updateUserDomains = async (emailId, domains) => {
  try {
    const response = await axios.put(`${baseUrl}/users/${emailId}/domains`, { domains });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update domains');
  }
};