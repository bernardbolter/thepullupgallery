declare namespace NodeJS {
  interface ProcessEnv {
    // WordPress API URL
    WORDPRESS_URL?: string;
    NEXT_PUBLIC_WORDPRESS_URL?: string;
    
    // WordPress Admin Credentials
    WORDPRESS_USERNAME?: string;
    NEXT_PUBLIC_WORDPRESS_USERNAME?: string;
    
    WORDPRESS_PASSWORD?: string;
    NEXT_PUBLIC_WORDPRESS_PASSWORD?: string;
    
    // WordPress Application Password (more secure for API access)
    WORDPRESS_APP_PASSWORD?: string;
    NEXT_PUBLIC_WORDPRESS_APP_PASSWORD?: string;
    
    // WordPress Nonce for REST API
    WORDPRESS_NONCE?: string;
    NEXT_PUBLIC_WP_NONCE?: string;
  }
}
