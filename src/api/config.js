import axios from 'axios';

// Note : A remplacerer ces valeurs par vos clés DatoCMS plus tard
export const API_URL = 'https://graphql.datocms.com';
export const API_TOKEN = 'VOTRE_TOKEN_API_DATOCMS_ICI';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});