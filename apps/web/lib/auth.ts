import axios from "axios";

export const login = async ({ credentials }: { credentials: any }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXTAUTH_URL}/auth/login`,
      credentials
    );
    return response.data; // Assuming API returns response data
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Failed to log in. Please check your credentials.");
  }
};

export const signup = async ({ credentials }: { credentials: any }) => {

  try {
    console.log("Signup credentials:", credentials);
    const response = await axios.post(
      `${process.env.NEXTAUTH_URL}/auth/signup`,
      credentials
    );
    return response.data; // Assuming API returns response data
  } catch (error) {
    console.error("Signup failed:", error);
    throw new Error("Failed to sign up. Please try again.");
  }
};