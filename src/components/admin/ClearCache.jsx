import React, {useContext} from 'react'
import API from '@/lib/api';
import log from 'xac-loglevel';
import URLS from '@/lib/urls';
import { App } from 'antd';
import { Button } from 'react-bootstrap';
import AdminContext from '@/context/AdminContext';

function ClearCache({ }) {
  const { message } = App.useApp();
  const { setAlert } = useContext(AdminContext);

  const clearCache = async () => {
    const url = URLS.api.local('admin/clear-cache');
    const res = await API.fetch({ url, method: 'DELETE' });
     setAlert(`ClearCache: ${JSON.stringify(res)}`);
    if (res.result) {
      message.success('Cache cleared.');
      sessionStorage.clear();
      log.debug('Admin.clearCache', res);
    }
  };

  return (
    <div className='c-clearCache'>
      <Button onClick={clearCache}>Clear Cache</Button>
    </div>
  );
}

export default ClearCache