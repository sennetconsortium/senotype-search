import API from '@/lib/api';
import AUTH from '@/lib/auth';
import URLS from '@/lib/urls';
import { createContext, useEffect, useState } from 'react';
import log from 'xac-loglevel';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [ontology, setOntology] = useState(null);

  const fetchAuth = async () => {
    const info = AUTH.info();
    const ops = { token: info.groups_token, method: 'GET' };

    let admin;
    let groups;
    let senotypeEdit;
    try {
      admin = await API.fetch({
        url: URLS.api.ingest.privs.admin,
        ...ops,
      });
    } catch (error) {
      admin = null;
      log.error(error);
    }
    try {
      senotypeEdit = await API.fetch({
        url: URLS.api.ingest.privs.senotypeEdit,
        ...ops,
      });
    } catch (error) {
      senotypeEdit = null;
      log.error(error);
    }
    try {
      groups = await API.fetch({
        url: URLS.api.ingest.privs.groups,
        ...ops,
      });
    } catch (error) {
      groups = null;
      log.error(error);
    }
    const isAuthenticated = groups?.user_write_groups !== undefined;
    setAuth({
      ...info,
      isAuthenticated,
      isAuthorized: isAuthenticated,
      hassenotypeEdit: senotypeEdit?.has_senotype_edit,
      isAdmin: admin?.has_data_admin_privs,
      userGroups: groups?.user_write_groups,
    });
  };

  const fetchOntology = async () => {
    if (!sessionStorage.getItem('oneTimeInit')) {
      const response = await fetch(URLS.api.local('ontology'));
      if (response.ok) {
        const result = await response.json();
        if (Object.keys(result.ontology).length) {
          window.ONTOLOGY_CACHE = result.ontology;
          setOntology(result.ontology);
          sessionStorage.setItem('oneTimeInit', true);
        }
      }
    } else {
      const result = await import('@/cache/ontology.js');
      window.ONTOLOGY_CACHE = result.ontology;
      setOntology(result.ontology);
    }
  };

  useEffect(() => {
    fetchOntology();
    fetchAuth();
  }, []);

  return (
    <AppContext.Provider
      value={{
        auth,
        ontology,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
