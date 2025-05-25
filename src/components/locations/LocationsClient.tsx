// components/locations/LocationsClient.tsx
'use client';

// import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export default function LocationsClient({ initialLocations }: { initialLocations: any }) {
  const t = useTranslations('Locations');
  console.log(initialLocations)

  return (
    <div>
      <h1>Locations</h1>
    </div>
  )
  
//   // Fetch locations data
//   const { data: locations, isLoading, error } = useQuery({
//     queryKey: ['locations'],
//     queryFn: async () => {
//       const response = await fetch('/api/locations');
//       if (!response.ok) {
//         throw new Error('Failed to fetch locations');
//       }
//       return response.json();
//     }
//   });

//   if (isLoading) return <div>{t('loading')}</div>;
//   if (error) return <div>{t('error')}: {error.message}</div>;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {locations?.map((location: any) => (
//         <div key={location.id} className="border rounded-lg p-4">
//           <h2 className="text-xl font-semibold">{location.name}</h2>
//           {/* Add more location details here */}
//         </div>
//       ))}
//     </div>
//   );
    }