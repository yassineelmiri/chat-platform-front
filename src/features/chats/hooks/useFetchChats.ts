// export const useChats = () => {
//     return useInfiniteQuer<Chat[], Error>({
//       queryKey: ['chats'],
//       queryFn: ({ pageParam = 1 }) => fetchChats({ pageParam }),
//       getNextPageParam: (lastPage, allPages) => {
//         // Determine if there is a next page based on the response
//         if (lastPage.length === PAGE_SIZE) {
//           return allPages.length + 1; // Next page number
//         } else {
//           return undefined; // No more pages
//         }
//       },
//       staleTime: 1000 * 60 * 5,
//     });
//   };