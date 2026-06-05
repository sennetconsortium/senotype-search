import { AntdRegistry } from '@ant-design/nextjs-registry';

import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MountedWrapper from '@/components/MountedWrapper';
import ENVS from '@/lib/envs';

export const metadata = {
  title: {
    default: 'Senoytpe Library',
    template: '%s | Senoytpe Library',
  },
};

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
