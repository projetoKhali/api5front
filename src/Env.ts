export const getApiUrl = (): string => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('API_URL is not defined');
  }

  return apiUrl;
};
