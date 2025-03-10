import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Inline,
  Text,
  ArrowLink,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './HeroBanner.css'
import {
  HeroLogo,
  HeroLogoMobile,
  LESchoolMobile,
} from '../../../../components/svg'
import { StatisticBox, HeroTiles } from './components'
import { ArrOfStatistics } from '../../../../types/interfaces'
import { Splash } from '../../../../components/svg'
import { useIsMobile } from '../../../../hooks'
import localization from '../../Home.json'

interface HeroBannerProps {
  statistics: ArrOfStatistics
}

export const HeroBanner = ({ statistics }: HeroBannerProps) => {
  const { isMobile } = useIsMobile()
  const loc = localization['heroBanner']

  return (
    <Box
      style={{
        borderBottom: `1px solid ${theme.color.blue200}`,
      }}
      background="blue100"
      display="flex"
      flexDirection={'column'}
    >
      <GridContainer>
        {isMobile ? (
          <Box paddingY={6}>
            <Stack space={2}>
              <HeroLogoMobile />
              <LESchoolMobile />
              <StatisticBox
                statistic={statistics?.casesInReview?.toLocaleString('de-DE')}
              />
              <Text>{loc.introText}</Text>
              <ArrowLink href={loc.arrowLink.internalLink.href}>
                {loc.arrowLink.internalLink.text}
              </ArrowLink>
              <ArrowLink href={loc.arrowLink.externalLink.href}>
                {loc.arrowLink.externalLink.text}
              </ArrowLink>
            </Stack>
          </Box>
        ) : (
          <GridRow className={styles.rowAlign}>
            <GridColumn span={['6/12']}>
              <Stack space={4}>
                <HeroLogo />
                <Stack space={3}>
                  <Text dataTestId="heroIntro">{loc.introText}</Text>
                  <Inline justifyContent="spaceBetween">
                    <ArrowLink href={loc.arrowLink.internalLink.href}>
                      {loc.arrowLink.internalLink.text}
                    </ArrowLink>
                    <ArrowLink href={loc.arrowLink.externalLink.href}>
                      {loc.arrowLink.externalLink.text}
                    </ArrowLink>
                  </Inline>
                </Stack>
              </Stack>
            </GridColumn>
            <GridColumn span={'6/12'}>
              <Box className={styles.bg}>
                <Splash />
              </Box>
              <Box className={styles.alignTiles}>
                <HeroTiles space={2} columns={[1]}>
                  <StatisticBox
                    statistic={statistics?.casesInReview?.toLocaleString(
                      'de-DE',
                    )}
                  />
                </HeroTiles>
              </Box>
            </GridColumn>
          </GridRow>
        )}
      </GridContainer>
    </Box>
  )
}
export default HeroBanner
