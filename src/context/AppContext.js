import API from '@/lib/api'
import AUTH from '@/lib/auth'
import URLS from '@/lib/urls'
import { createContext, useEffect, useState } from 'react'

const AppContext = createContext({})

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState({})
  const [ontology, setOntology] = useState(null)

  const fetchAuth = async () => {
    const info = AUTH.info()
    const ops = {token: info.groups_token, method: 'GET'}
    const admin = await API.fetch({url: URLS.api.ingest.privs.admin, ...ops})
    const groups = await API.fetch({url: URLS.api.ingest.privs.groups, ...ops})
    setAuth({...info, isAuthenticated: admin !== null, isAuthorized: admin !== null, isAdmin: admin.has_data_admin_privs, userGroups: groups.user_write_groups})
  }

  const fetchOntology = async () => {
    if (!sessionStorage.getItem('oneTimeInit')) {
      const response = await fetch(URLS.api.local('ontology'))
      if (response.ok) {
        const result = await response.json()
        if (Object.keys(result.ontology).length) {
          window.ONTOLOGY_CACHE = result.ontology
          setOntology(result.ontology)
          sessionStorage.setItem('oneTimeInit', true)
        }
      }
   } else {
      const result = await import('@/cache/ontology.js')
      window.ONTOLOGY_CACHE = result.ontology
      setOntology(result.ontology)
   }
    
  }

  useEffect(() => {
    fetchOntology()
    fetchAuth()
  }, [])

  return (
    <AppContext.Provider
      value={{
        auth,
        ontology
      }}>{children}
    </AppContext.Provider>
  )
}

export default AppContext