import BaseLayout from '@/components/layouts/BaseLayout'
import { ChildProps } from '@/types/children'
import React from 'react'

export default function layout({ children }: ChildProps) {
    return (
        <BaseLayout>
            {children}
        </BaseLayout>
    )
}
