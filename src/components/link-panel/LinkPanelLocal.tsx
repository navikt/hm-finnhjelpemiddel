import { Link as AkselLink, HGrid, HStack, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import Link from 'next/link'
import styles from './LinkPanelLocal.module.scss'

const LinkPanelLocal = ({
  title,
  description,
  href,
  icon,
  className,
  largeIcon = false,
}: {
  title: string
  description?: string
  href: string
  icon: React.ReactNode
  className?: string
  largeIcon?: boolean
}) => {
  return (
    <AkselLink as={Link} href={href} className={classNames(styles.linkPanel, className)}>
      {largeIcon ? (
        <HGrid gap="3">
          {icon}
          <VStack gap="2">
            <span className={styles.linkPanel__title}>{title}</span>
            <span className={styles.linkPanel__description}>{description}</span>
          </VStack>
        </HGrid>
      ) : (
        <VStack gap="2">
          <HStack gap="3">
            {icon}
            <span className={styles.linkPanel__title}>{title}</span>
          </HStack>
          <span className={styles.linkPanel__description}>{description}</span>
        </VStack>
      )}
    </AkselLink>
  )
}

export default LinkPanelLocal
