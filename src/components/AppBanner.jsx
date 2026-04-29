import { useContext, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import AppContext from '@/context/AppContext';
import log from 'xac-loglevel'

function AppBanner({ key = 'default' }) {
  const { bannerContent } = useContext(AppContext);

  useEffect(() => {
    log.debug('AppBanner.useEffect', bannerContent)
  }, [bannerContent])

  if (!bannerContent[key]) {
    return <></>
  }
  const banner = bannerContent[key];
  return (
    <div className={`c-banner ${banner.containerClassName || 'mt-3'}`}>
      {banner && (
        <Alert variant={banner.variant}>
          {banner.title && <Alert.Heading>{banner.title}</Alert.Heading>}
          <div dangerouslySetInnerHTML={{ __html: banner.content }}></div>
        </Alert>
      )}
    </div>
  );
}

export default AppBanner;
