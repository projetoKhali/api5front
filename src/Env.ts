export const getApiUrl = (): string => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('api url is not defined in environment variables');
  }

  return apiUrl;
};
