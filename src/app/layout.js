import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MountedWrapper from '@/components/MountedWrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <AntdRegistry>
            <MountedWrapper>{children}</MountedWrapper>
          </AntdRegistry>
        </ErrorBoundary>
      </body>
    </html>
  );
}
