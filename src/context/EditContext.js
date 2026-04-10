import { createContext, useEffect, useState } from 'react';

const EditContext = createContext({});

export const EditProvider = ({ children }) => {
  const [senotype, setSenotype] = useState(null);

  useEffect(() => {}, []);

  return (
    <EditContext.Provider
      value={{
        senotype,
        setSenotype,
      }}
    >
      {children}
    </EditContext.Provider>
  );
};

export default EditContext;
