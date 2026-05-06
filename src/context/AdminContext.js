import { createContext, useState } from 'react';
import { Alert } from 'react-bootstrap';

const AdminContext = createContext({});

export const AdminProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
 

  return (
    <AdminContext.Provider
      value={{
        setAlert,
      }}
    >
      {children}
      {alert && (
        <Alert className="mt-4" style={{maxHeight: '700px', overflowY: 'auto'}}>
          <code>{alert}</code>
        </Alert>
      )}
    </AdminContext.Provider>
  );
};

export default AdminContext;
