import LocationsClient from '@/components/locations/LocationsClient';

export default async function LocationsPage() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_URL_GRAPHQL as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query GetPullupLocations {
                        pullupLocations {
                            nodes {
                                title
                                pullupLocation {
                                    lat
                                    lng
                                }
                            }
                        }
                    }`
            }),
            next: { revalidate: 3600 }
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const result = await response.json();
        // console.log("Full GraphQL response:", result);
        
        if (result.errors) {
            console.error("GraphQL Errors:", result.errors);
            throw new Error('GraphQL query failed');
        }
    
        const locations = result.data?.pullupLocations?.nodes || [];
        
        return <LocationsClient initialLocations={locations} />;
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw error; // This will be caught by Next.js error boundary
    }
}