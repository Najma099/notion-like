import './globals.css';
import { Toaster } from "sonner";
import { AuthProvider } from '@/context/AuthContext'; 
import { WorkspaceProvider } from '@/context/WorkspaceContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WorkspaceProvider>
             {children}
          </WorkspaceProvider>
        </AuthProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}