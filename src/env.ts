// This file exposes environment variables to the client-side code
// Only add variables that are safe to expose to the client

export const env = {
  // WordPress API URL
  WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || 'https://digitalcityseries.com/bolter',
};
