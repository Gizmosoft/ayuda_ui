import getBaseUrl from "../utils/BaseUrl";
import axios from "axios";

const baseUrl = getBaseUrl();

export const getRecommendations = async (user) => {
    const courses = await axios.get(baseUrl + '/courses/recommendations', {
        params: { email: user.email }
      });
    return courses;
}