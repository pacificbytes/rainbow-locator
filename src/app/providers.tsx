'use client';

import { SessionProvider } from 'next-auth/react'; // v5 compatible
import { Session } from 'next-auth';

type Props = {
  children?: React.ReactNode;
  session?: Session | null;
};

const Providers = ({ children, session }: Props) => (
  <SessionProvider session={session}>
    {children}
  </SessionProvider>
);

export default Providers;
