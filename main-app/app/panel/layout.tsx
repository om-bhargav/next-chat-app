import SocketAnnouncer from '@/components/global/SocketAnnouncer'
import PanelLayout from '@/components/panel/PanelLayout'
import AuthWrapper from '@/components/providers/AuthWrapper'
import { ChildProps } from '@/types/children'

export default function layout({ children }: ChildProps) {
  return (
    <AuthWrapper>
      <PanelLayout>
      <SocketAnnouncer/>
        {children}
      </PanelLayout>
    </AuthWrapper>
  )
}
