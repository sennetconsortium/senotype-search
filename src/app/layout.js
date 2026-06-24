import { AntdRegistry } from '@ant-design/nextjs-registry';

import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MountedWrapper from '@/components/MountedWrapper';
import ENVS from '@/lib/envs';
import { headers } from 'next/headers';

export async function generateMetadata({ params }) {
  const _headers = await headers();
  const { senotype_id } = await params;
  const url = new URL(_headers.get('x-url'));
  const baseTitle = ENVS.app.name;
  const pageParts = url.pathname.split('/');
  let pageTitle = pageParts[1]?.toTitleCase();
  let subTitle =
    ['create', 'edit'].indexOf(pageParts[2]) != -1
      ? `| ${pageParts[2]?.toTitleCase()}`
      : '';
  
  pageTitle = pageTitle ? `${pageTitle} ${subTitle} | ${baseTitle}` : baseTitle;

  return {
    title: {
      default: pageTitle,
      template: `%s | ${baseTitle}`,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <MountedWrapper gtmId={ENVS.gtm}>{children}</MountedWrapper>
        </AntdRegistry>
      </body>
    </html>
  );
}
