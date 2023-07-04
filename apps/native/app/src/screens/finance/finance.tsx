import {
  DynamicColorIOS,
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {
  Button,
  FinanceStatusCard,
  Heading,
  TableViewCell,
  Typography,
  blue400,
  dynamicColor,
  font,
} from '@ui';
import getFinanceStatus from './getFinanceStatus.json';
import getDebtStatus from './getDebtStatus.json';
import getFinanceStatusDetails from './getFinanceStatusDetails.json';
import {FormattedMessage, useIntl} from 'react-intl';
import styled, {useTheme} from 'styled-components/native';
import {useState} from 'react';
import externalOpen from '../../assets/icons/external-open.png';
import chevronDown from '../../assets/icons/chevron-down.png';
import { navigateTo } from '../../lib/deep-linking';

const Row = styled.View<{border?: boolean}>`
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;

  border-bottom-color: ${dynamicColor(({theme}) => ({
    light: theme.color.blue100,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: ${({border}) => (border ? 1 : 0)}px;
`;

const Cell = styled.View`
  margin-right: 8px;
  margin-left: 8px;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const TouchableRow = styled.TouchableHighlight`
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom-color: ${dynamicColor(({theme}) => ({
    light: theme.color.blue100,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: 1px;
`;

const AboutBox = styled.View`
  padding: 16px;
  border-top-color: ${dynamicColor(({theme}) => ({
    light: theme.color.blueberry200,
    dark: theme.shades.dark.shade300,
  }))};
  border-top-width: 1px;
  margin-top: 0px;
`;

const LightButton = (props: any) => {
  const theme = useTheme();
  return (
    <Button
      {...props}
      isOutlined
      iconStyle={{
        tintColor: blue400,
      }}
      style={{
        borderColor: Platform.select<any>({
          ios: DynamicColorIOS({
            dark: theme.shades.dark.shade300,
            light: theme.color.blue200,
          }),
          android:
            theme.colorScheme === 'dark'
              ? theme.shades.dark.shade300
              : theme.color.blue200,
        }),
        paddingTop: 8,
        paddingBottom: 8,
        minWidth: 0,
      }}
      textProps={{
        lineBreakMode: 'tail',
        numberOfLines: 1,
      }}
      textStyle={{
        textAlign: 'left',
        fontSize: 12,
        fontWeight: '500',
        color: Platform.select<any>({
          ios: DynamicColorIOS({
            dark: theme.shades.dark.foreground,
            light: theme.shades.light.foreground,
          }),
          android:
            theme.colorScheme === 'dark'
              ? theme.shades.dark.foreground
              : theme.shades.light.foreground,
        }),
        ...props.textStyle,
      }}
    />
  );
};

const Text = styled.Text<{size?: number; weight?: string; color?: string}>`
  ${props => {
    const result = font({
      fontSize: props.size ?? 13,
      fontWeight: props.weight as any,
    });
    return result;
  }}
`;

function FinanceStatusCardContainer(props: any) {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const {chargeType, org} = props;

  const {loading, error, ...detailsQuery} = {
    loading: false,
    error: null,
    ...getFinanceStatusDetails,
  };
  const financeStatusDetails = detailsQuery.data?.getFinanceStatusDetails || {};

  return (
    <FinanceStatusCard
      title={chargeType.name}
      message={
        <FormattedMessage
          id="finance.statusCard.status"
          defaultMessage="Staða"
        />
      }
      value={`${intl.formatNumber(chargeType.totals)} kr.`}
      onPress={() => {
        setOpen(p => !p);
      }}
      open={open}
    >
      <View style={{width: '100%', padding: 16}}>
        <Text weight="500" style={{color: blue400, marginBottom: 8}}>
          <FormattedMessage
            id="finance.statusCard.paymentBase"
            defaultMessage="Gjaldgrunnur"
          />
        </Text>
        <LightButton
          title="2203030560"
          icon={chevronDown}
          textStyle={{flex: 1}}
          onPress={() => {
            // void
          }}
        />
        <Row style={{marginTop: 12}}>
          <Cell style={{flex: 1}}>
            <Text weight="600">
              <FormattedMessage
                id="finance.statusCard.deadline"
                defaultMessage="Eindagi"
              />
            </Text>
          </Cell>
          <Cell style={{flex: 1}}>
            <Text style={{fontWeight: '600', textAlign: 'right'}}>
              <FormattedMessage
                id="finance.statusCard.amount"
                defaultMessage="Upphæð"
              />
            </Text>
          </Cell>
        </Row>
        {financeStatusDetails?.chargeItemSubjects?.map((charge, index) => (
          <TouchableRow
            key={index}
            underlayColor="rgba(128,128,128,0.1)"
            onPress={() => {
              navigateTo(`/finance/status/${org.id}/${chargeType.id}`);
            }}
          >
            <>
              <Cell style={{flex: 1}}>
                <Text>{charge.finalDueDate}</Text>
              </Cell>
              <Cell style={{flex: 1}}>
                <Text style={{textAlign: 'right'}}>
                  {intl.formatNumber(charge.totals)} kr.
                </Text>
              </Cell>
              <Image
                source={chevronDown}
                style={{
                  tintColor: 'rgba(128,128,128,0.6)',
                  transform: [
                    {rotate: '-90deg'},
                    {
                      translateY: -1,
                    },
                    {
                      translateX: -6,
                    },
                  ],
                }}
              />
            </>
          </TouchableRow>
        ))}
        <Row>
          <Cell style={{flex: 1, alignItems: 'flex-end'}}>
            <Text weight="600" style={{marginBottom: 4}}>
              <FormattedMessage
                id="finance.statusCard.total"
                defaultMessage="Samtals"
              />
            </Text>
            <Text>{intl.formatNumber(chargeType.totals)} kr.</Text>
          </Cell>
        </Row>
      </View>
      <AboutBox>
        <Text weight="600">
          <FormattedMessage
            id="finance.statusCard.organization"
            defaultMessage="Þjónustuaðili"
          />
        </Text>
        <Text style={{paddingTop: 4}}>{org.name}</Text>
        <Row>
          {org.homepage ? (
            <Cell>
              <Text weight="600">
                <FormattedMessage
                  id="finance.statusCard.organizationWebsite"
                  defaultMessage="Vefur"
                />
                :
              </Text>
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    `https://${org.email.replace(/https?:\/\//, '')}`,
                  )
                }
              >
                <Text style={{paddingTop: 4, color: blue400}}>
                  {org.homepage}
                </Text>
              </Pressable>
            </Cell>
          ) : null}
          {org.email ? (
            <Cell>
              <Text weight="600">
                <FormattedMessage
                  id="finance.statusCard.organizationEmail"
                  defaultMessage="Netfang"
                />
                :
              </Text>
              <Pressable onPress={() => Linking.openURL(`mailto:${org.email}`)}>
                <Text style={{paddingTop: 4, color: blue400}}>{org.email}</Text>
              </Pressable>
            </Cell>
          ) : null}
          {org.phone ? (
            <Cell>
              <Text weight="600">
                <FormattedMessage
                  id="finance.statusCard.organizationPhone"
                  defaultMessage="Sími"
                />
                :
              </Text>
              <Pressable onPress={() => Linking.openURL(`tel:${org.phone}`)}>
                <Text style={{paddingTop: 4, color: blue400}}>{org.phone}</Text>
              </Pressable>
            </Cell>
          ) : null}
        </Row>
      </AboutBox>
    </FinanceStatusCard>
  );
}

const {
  useNavigationOptions,
  getNavigationOptions,
} = createNavigationOptionHooks(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: intl.formatMessage({id: 'finance.screenTitle'}),
      },
    },
  }),
  {
    topBar: {
      largeTitle: {
        visible: true,
      },
      scrollEdgeAppearance: {
        active: true,
        noBorder: true,
      },
    },
  },
);

export const FinanceScreen: NavigationFunctionComponent = ({componentId}) => {
  useNavigationOptions(componentId);
  const intl = useIntl();
  const {loading, error, ...statusQuery} = {
    loading: false,
    error: false,
    ...getFinanceStatus,
  };

  const {data: debtStatusData, loading: debtStatusLoading} = {
    loading: false,
    ...getDebtStatus,
  };

  const debtStatus = debtStatusData?.getDebtStatus?.myDebtStatus;
  let scheduleButtonVisible = false;
  if (debtStatus && debtStatus.length > 0 && !debtStatusLoading) {
    scheduleButtonVisible =
      debtStatus[0]?.approvedSchedule > 0 ||
      debtStatus[0]?.possibleToSchedule > 0;
  }

  const financeStatusData = statusQuery.data?.getFinanceStatus || {};

  function getChargeTypeTotal() {
    const organizationChargeTypes = financeStatusData?.organizations?.map(
      org => org.chargeTypes,
    );
    const allChargeTypes = organizationChargeTypes.flat();

    const chargeTypeTotal =
      allChargeTypes.length > 0
        ? allChargeTypes.reduce((a, b) => a + b.totals, 0)
        : 0;

    return chargeTypeTotal; // @todo amountFormat
  }

  // const endOfYearMessage = defineMessage({
  //   id: 'sp.finance-status:end-of-year',
  //   defaultMessage: 'Staða í lok árs {year}',
  //   description: 'A welcome message',
  // })

  // const previousYear = subYears(new Date(), 1).getFullYear().toString();
  // const twoYearsAgo = subYears(new Date(), 2).getFullYear().toString();
  const financeStatusZero = financeStatusData?.statusTotals === 0;

  return (
    <ScrollView style={{flex: 1}}>
      <SafeAreaView style={{marginHorizontal: 16}}>
        <Heading>
          <FormattedMessage
            id="finance.heading.title"
            defaultMessage="Staða við ríkissjóð og stofnanir"
          />
        </Heading>
        <Typography>
          <FormattedMessage
            id="finance.heading.subtitle"
            defaultMessage="Hér sérð þú sundurliðun skulda og/eða inneigna hjá ríkissjóði og stofnunum."
          />
        </Typography>
      </SafeAreaView>
      <TableViewCell
        style={{
          marginTop: 16,
          marginBottom: 24,
        }}
        title={
          <Text size={13} style={{marginBottom: 4}}>
            <FormattedMessage
              id="finance.statusCard.total"
              defaultMessage="Samtals"
            />
            :
          </Text>
        }
        subtitle={
          <Text size={20} weight="600">{`${intl.formatNumber(
            getChargeTypeTotal(),
          )} kr.`}</Text>
        }
      />
      {financeStatusData.organizations?.length > 0 || financeStatusZero ? (
        <SafeAreaView
          style={{
            marginHorizontal: 16,
            marginBottom: 24,
            alignItems: 'flex-start',
          }}
        >
          {scheduleButtonVisible && (
            <LightButton
              title={
                <FormattedMessage
                  id="finance.statusCard.schedulePaymentPlan"
                  defaultMessage="Gera greiðsluáætlun"
                />
              }
              icon={externalOpen}
            />
          )}
        </SafeAreaView>
      ) : null}
      <SafeAreaView style={{marginHorizontal: 16}}>
        {financeStatusData?.organizations?.length > 0 || financeStatusZero
          ? financeStatusData?.organizations?.map((org: any, i) =>
              org.chargeTypes.map((chargeType: any, ii: number) => (
                <FinanceStatusCardContainer
                  key={`${org.id}-${chargeType.id}-${i}-${ii}`}
                  chargeType={chargeType}
                  org={org}
                />
              )),
            )
          : null}
      </SafeAreaView>
    </ScrollView>
  );
};

FinanceScreen.options = getNavigationOptions;
