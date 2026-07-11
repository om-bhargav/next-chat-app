import { ChildProps } from '@/types/children'
import { ThemeProvider } from './ThemeProvider'
import LenisProvider from './LenisProvider'
import { ClerkProvider } from "@clerk/nextjs";
import {Toaster} from "sonner";
export default function Providers({ children }: ChildProps) {

  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster richColors closeButton position='bottom-center'/>
        <LenisProvider>
          {children}
        </LenisProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}
