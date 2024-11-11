// import { useInfiniteQuery } from '@tanstack/react-query';
// import { Chat } from '../../dummyData/chats';

// const PAGE_SIZE = 10; // Number of items per page

// // Adjusted fetchChats function to support backend pagination
// const fetchChats = async ({ pageParam = 1 }): Promise<Chat[]> => {
//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjhmNjE2NzQ5NGU2NTFhNmEyZTJlMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzMxMzI5NDU4LCJleHAiOjE3MzE0MTU4NTh9.ewVq-B3OLmgv2QcjoyfUvKhaOJavu8cME0tV8SF1fMY"
//   const response = await fetch(`/api/conversations?page=${pageParam}&limit=${PAGE_SIZE}`, {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Failed to fetch chats');
//   }

//   const data = await response.json();
//   return data.chats; // Adjust according to your API's response structure
// };

// // Hook to fetch chats with infinite scrolling
// export const useChats = () => {
//   return useInfiniteQuery<Chat[], Error>({
//     queryKey: ['chats'],
//     queryFn: ({ pageParam = 1 }) => fetchChats({ pageParam }),
//     initialPageParam: 1, // Specify the initial page parameter
//     getNextPageParam: (lastPage, allPages) => {
//       // If the last page has the full page size, there might be more data
//       if (lastPage.length === PAGE_SIZE) {
//         return allPages.length + 1; // Next page number
//       } else {
//         return undefined; // No more pages
//       }
//     },
//     staleTime: 1000 * 60 * 5,
//   });
// };