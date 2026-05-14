import API from '@/lib/api';
import AUTH from '@/lib/auth';
import ENVS from '@/lib/envs';
import URLS from '@/lib/urls';
import { createContext, useEffect, useState } from 'react';
import log from 'xac-loglevel';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [ontology, setOntology] = useState(null);
  const [bannerContent, setBannerContent] = useState({});

  const fetchAuth = async () => {
    const info = AUTH.info();
    const ops = { token: info.groups_token, method: 'GET' };

    let admin;
    let groups;
    let senotypeEdit;
    let senotypeCurate;
    let senotypePublish;
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
      senotypeCurate = await API.fetch({
        url: URLS.api.ingest.privs.senotypeCurate,
        ...ops,
      });
    } catch (error) {
      senotypeCurate = null;
      log.error(error);
    }
    try {
      senotypePublish = await API.fetch({
        url: URLS.api.ingest.privs.senotypePublish,
        ...ops,
      });
    } catch (error) {
      senotypePublish = null;
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
      hasSenotypeEdit: senotypeEdit?.has_senotype_edit,
      hasSenotypeCurate: senotypeCurate?.has_senotype_curate,
      hasSenotypePublish: senotypePublish?.has_senotype_publish,
      isAdmin: admin?.has_data_admin_privs,
      userGroups: groups?.user_write_groups,
      isSameUser: (userId) => info.globus_id?.eq(userId),
    });
  };

  const fetchOntology = async () => {
    const response = await fetch(URLS.api.local('ontology'));
    if (response.ok) {
      const result = await response.json();
      if (Object.keys(result.ontology).length) {
        window.ONTOLOGY_CACHE = result.ontology;
        setOntology(result.ontology);
      }
    }
  };

  const fetchBannerContent = async () => {
    const url = URLS.api.local('content/banner');
    const results = await API.fetch({ url, method: 'GET' });
    if (Object.values(results).length) {
      setBannerContent(results);
    }
  };

  const setLoglevel = async () => {
    // Set browser level loglevel
    log.setLevel(ENVS.logLevel);
    console.log('Browser logging in level:', await log.getLevel());
  };

  useEffect(() => {
    fetchOntology();
    fetchAuth();
    fetchBannerContent();
    setLoglevel()
  }, []);

  const canEdit = (senotype) => {
    if (Object.values(auth).length <= 0) return false
    return (
      auth?.hasSenotypePublish ||
      auth?.hasSenotypeCurate ||
      (auth?.isSameUser && auth?.isSameUser(senotype?.created_by_user_sub))
    );
  };

  const hasCreatorAccess = () =>
    auth?.hasSenotypePublish || auth?.hasSenotypeCurate || auth?.hasSenotypeEdit;

  return (
    <AppContext.Provider
      value={{
        auth,
        ontology,
        bannerContent,
        canEdit,
        hasCreatorAccess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
