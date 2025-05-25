// app/[locale]/artists/page.tsx
import ArtistsClient from '@/components/artists/ArtistsClient';

export default async function ArtistsPage() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_URL_GRAPHQL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetPullupArtists {
            pullupArtists {
              nodes {
                title
                slug
              }
            }
          }`
      }),
      next: { revalidate: 3600 } // Optional: Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    // console.log("Full GraphQL response:", JSON.stringify(result, null, 2));
    
    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      throw new Error('GraphQL query failed');
    }
    
    const artists = result.data?.pullupArtists?.nodes || [];
    // console.log("Processed artists data:", JSON.stringify(artists, null, 2));
    
    return <ArtistsClient initialArtists={artists} />;
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error; // This will be caught by Next.js error boundary
  }
}