import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export function DataProvider({ children }) {
   const [sharedData, setSharedData] = useState(null);
   const [searchString, setSearchString] = useState(null);

   return (
     <DataContext.Provider value={{ sharedData, setSharedData, searchString, setSearchString }}>
       {children}
     </DataContext.Provider>
   );
}
