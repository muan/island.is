import { defineMessages, defineMessage } from 'react-intl'

export const sections = {
  title: defineMessage({
    id: 'judicial.system.core:sections.title',
    defaultMessage:
      '{caseType, select, CUSTODY {Gæsluvarðhald} TRAVEL_BAN {Farbann} ADMISSION_TO_FACILITY {Vistun á viðeignadi stofnun} other {Rannsóknarheimild}}',
    description: 'Notaður sem titill á hliðarstiku í öllum ferlum',
  }),
  indictmentTitle: defineMessage({
    id: 'judicial.system.core:sections.indictment_title',
    defaultMessage: 'Sakamál',
    description: 'Notaður sem titill á hliðarstiku í sakamálum',
  }),
  restrictionCaseProsecutorSection: defineMessages({
    caseTitle: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.case_title',
      defaultMessage:
        'Krafa um {caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbann} other {gæsluvarðhald}}',
      description:
        'Notaður sem titill í hliðarstiku í gæslu-, farbanns- og vistunarmálum hjá sækjendum',
    },
    hearingArrangements: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.hearing_arrangements',
      defaultMessage: 'Óskir um fyrirtöku',
      description:
        'Notaður sem texti fyrir Óskir um fyrirtöku skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    policeDemands: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.police_demands',
      defaultMessage: 'Dómkröfur og lagagrundvöllur',
      description:
        'Notaður sem texti fyrir Dómkröfur og lagagrundvöllur skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    policeReport: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.police_report',
      defaultMessage: 'Greinargerð',
      description:
        'Notaður sem texti fyrir Greinargerð skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    caseFiles: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.case_files',
      defaultMessage: 'Rannsóknargögn',
      description:
        'Notaður sem texti fyrir Rannsóknargögn skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    overview: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í gæslu-, vinstunar- og farbannsmálum hjá sækjendum',
    },
  }),
  investigationCaseProsecutorSection: defineMessages({
    title: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.title',
      defaultMessage: 'Krafa um rannsóknarheimild',
      description:
        'Notaður sem titill í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
    hearingArrangements: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.hearing_arrangements',
      defaultMessage: 'Óskir um fyrirtöku',
      description:
        'Notaður sem texti fyrir Óskir um fyrirtöku skref í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
    policeDemands: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.police_demands',
      defaultMessage: 'Dómkröfur og lagagrundvöllur',
      description:
        'Notaður sem texti fyrir Dómkröfur og lagagrundvöllur skref í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
    policeReport: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.police_report',
      defaultMessage: 'Greinargerð',
      description:
        'Notaður sem texti fyrir Greinargerð skref í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
    caseFiles: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.case_files',
      defaultMessage: 'Rannsóknargögn',
      description:
        'Notaður sem texti fyrir Rannsóknargögn skref í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
    overview: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
  }),
  indictmentCaseProsecutorSection: defineMessages({
    title: {
      id:
        'judicial.system.core:sections.indictment_case_prosecutor_section.title',
      defaultMessage: 'Ákærumeðferð',
      description: 'Notaður sem titill í hliðarstiku í ákærum hjá sækjendum',
    },
    processing: {
      id:
        'judicial.system.core:sections.indictment_case_prosecutor_section.processing',
      defaultMessage: 'Málsmeðferð',
      description:
        'Notaður sem texti fyrir Málsmeðferð skref í hliðarstiku í ákærum hjá sækjendum',
    },
    caseFiles: {
      id:
        'judicial.system.core:sections.indictment_case_prosecutor_section.case_files',
      defaultMessage: 'Dómskjöl',
      description:
        'Notaður sem texti fyrir Dómskjöl skref í hliðarstiku í ákærum hjá sækjendum',
    },
    policeCaseFiles: {
      id:
        'judicial.system.core:sections.indictment_case_prosecutor_section.police_case_files',
      defaultMessage: 'Málsgögn',
      description:
        'Notaður sem texti fyrir Málsgögn skref í hliðarstiku í ákærum hjá sækjendum',
    },
    overview: {
      id:
        'judicial.system.core:sections.indictment_case_prosecutor_section.overview',
      defaultMessage: 'Yfirlit ákæru',
      description:
        'Notaður sem texti fyrir Yfirlit ákæru skref í hliðarstiku í ákærum hjá sækjendum',
    },
  }),
  investigationCaseCourtSection: defineMessages({
    title: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.title',
      defaultMessage: 'Úrskurður Héraðsdóms',
      description:
        'Notaður sem titill í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
    overview: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
    hearingArrangements: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.hearingArrangements',
      defaultMessage: 'Fyrirtaka',
      description:
        'Notaður sem texti fyrir Fyrirtaka skref í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
    courtRecord: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.court_record',
      defaultMessage: 'Þingbók',
      description:
        'Notaður sem texti fyrir Þingbók skref í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
    ruling: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.ruling',
      defaultMessage: 'Úrskurður',
      description:
        'Notaður sem texti fyrir Úrskurður skref í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
    conclusion: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.conclusion',
      defaultMessage: 'Yfirlit úrskurðar',
      description:
        'Notaður sem texti fyrir Yfirlit úrskurðar skref í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
  }),
  courtSection: defineMessages({
    title: {
      id: 'judicial.system.core:sections.court_section.title',
      defaultMessage: 'Úrskurður Héraðsdóms',
      description:
        'Notaður sem titill í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    receptionAndAssignment: {
      id:
        'judicial.system.core:sections.court_section.reception_and_assignment',
      defaultMessage: 'Móttaka',
      description:
        'Notaður sem texti fyrir Móttaka skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    overview: {
      id: 'judicial.system.core:sections.court_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    hearingArrangements: {
      id: 'judicial.system.core:sections.court_section.hearingArrangements',
      defaultMessage: 'Fyrirtaka',
      description:
        'Notaður sem texti fyrir Fyrirtaka skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    courtRecord: {
      id: 'judicial.system.core:sections.court_section.court_record',
      defaultMessage: 'Þingbók',
      description:
        'Notaður sem texti fyrir Þingbók skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    ruling: {
      id: 'judicial.system.core:sections.court_section.ruling',
      defaultMessage: 'Úrskurður',
      description:
        'Notaður sem texti fyrir Úrskurður skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    conclusion: {
      id: 'judicial.system.core:sections.court_section.conclusion',
      defaultMessage: 'Yfirlit úrskurðar',
      description:
        'Notaður sem texti fyrir Yfirlit úrskurðar skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
  }),
  indictmentsCourtSection: defineMessages({
    title: {
      id: 'judicial.system.core:sections.indictments_court_section.title',
      defaultMessage: 'Málsmeðferð Héraðsdóms',
      description: 'Notaður sem titill í hliðarstiku í ákærum hjá héraðsdómum',
    },
    overview: {
      id: 'judicial.system.core:sections.indictments_court_section.overview',
      defaultMessage: 'Yfirlit',
      description:
        'Notaður sem texti fyrir Yfirlit skref í hliðarstiku í ákærum hjá héraðsdómum',
    },
    receptionAndAssignment: {
      id:
        'judicial.system.core:sections.indictments_court_section.reception_and_assignment',
      defaultMessage: 'Móttaka',
      description:
        'Notaður sem texti fyrir Móttaka skref í hliðarstiku í ákærum hjá héraðsdómum',
    },
    subpoena: {
      id: 'judicial.system.core:sections.indictments_court_section.subpoena',
      defaultMessage: 'Fyrirkall',
      description:
        'Notaður sem texti fyrir Fyrirkall skref í hliðarstiku í ákærum hjá héraðsdómum',
    },
    prosecutorAndDefender: {
      id:
        'judicial.system.core:sections.indictments_court_section.prosecutor_and_defender',
      defaultMessage: 'Málflytjendur',
      description:
        'Notaður sem texti fyrir Málflytjendur skref í hliðarstiku í ákærum hjá héraðsdómum',
    },
    courtRecord: {
      id:
        'judicial.system.core:sections.indictments_court_section.court_record',
      defaultMessage: 'Þingbók og dómur',
      description:
        'Notaður sem texti fyrir Þingbók og dómur skref í hliðarstiku í ákærum hjá héraðsdómum',
    },
  }),
  extensionSection: defineMessages({
    title: {
      id: 'judicial.system.core:sections.extension_section.title',
      defaultMessage: 'Krafa um framlengingu',
      description:
        'Notaður sem titill í hliðarstiku í framlengingdum gæslu- og farbannsmálum',
    },
    hearingArrangements: {
      id:
        'judicial.system.core:sections.extension_section.hearing_arrangements',
      defaultMessage: 'Óskir um fyrirtöku',
      description:
        'Notaður sem texti fyrir Óskir um fyrirtöku skref í hliðarstiku í framlengdum gæslu- og farbannsmálum hjá sækjendum',
    },
    policeDemands: {
      id: 'judicial.system.core:sections.extension_section.police_demands',
      defaultMessage: 'Dómkröfur og lagagrundvöllur',
      description:
        'Notaður sem texti fyrir Dómkröfur og lagagrundvöllur skref í hliðarstiku í framlengdum gæslu- og farbannsmálum hjá sækjendum',
    },
    policeReport: {
      id: 'judicial.system.core:sections.extension_section.police_report',
      defaultMessage: 'Greinargerð',
      description:
        'Notaður sem texti fyrir Greinargerð skref í hliðarstiku í framlengdum gæslu- og farbannsmálum hjá sækjendum',
    },
    caseFiles: {
      id: 'judicial.system.core:sections.extension_section.case_files',
      defaultMessage: 'Rannsóknargögn',
      description:
        'Notaður sem texti fyrir Rannsóknargögn skref í hliðarstiku í framlengdum gæslu- og farbannsmálum hjá sækjendum',
    },
    overview: {
      id: 'judicial.system.core:sections.extension_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í framlengdum gæslu- og farbannsmálum hjá sækjendum',
    },
  }),
  investigationCaseExtensionSection: defineMessages({
    title: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.title',
      defaultMessage: 'Krafa um framlengingu',
      description:
        'Notaður sem titill í hliðarstiku í framlengingdum rannsóknarheimildum',
    },
    hearingArrangements: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.hearing_arrangements',
      defaultMessage: 'Óskir um fyrirtöku',
      description:
        'Notaður sem texti fyrir Óskir um fyrirtöku skref í hliðarstiku í framlengdum rannsóknarheimildum hjá sækjendum',
    },
    policeDemands: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.police_demands',
      defaultMessage: 'Dómkröfur og lagagrundvöllur',
      description:
        'Notaður sem texti fyrir Dómkröfur og lagagrundvöllur skref í hliðarstiku í framlengdum rannsóknarheimildum hjá sækjendum',
    },
    policeReport: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.police_report',
      defaultMessage: 'Greinargerð',
      description:
        'Notaður sem texti fyrir Greinargerð skref í hliðarstiku í framlengdum rannsóknarheimildum hjá sækjendum',
    },
    caseFiles: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.case_files',
      defaultMessage: 'Rannsóknargögn',
      description:
        'Notaður sem texti fyrir Rannsóknargögn skref í hliðarstiku í framlengdum rannsóknarheimildum hjá sækjendum',
    },
    overview: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í framlengdum rannsóknarheimildum hjá sækjendum',
    },
  }),
  caseResults: defineMessages({
    dissmissed: {
      id: 'judicial.system.core:sections.case_results.dissmissed',
      defaultMessage: 'Kröfu vísað frá',
      description:
        'Notaður sem texti í skrefum á hliðarstiku þegar kröfu er vísað frá',
    },
    restrictionActive: {
      id: 'judicial.system.core:sections.case_results.restriction_active',
      defaultMessage:
        '{caseType, select, ADMISSION_TO_FACILITY {Vistun virk} TRAVEL_BAN {Farbann virkt} other {Gæsluvarðhald virkt}}',
      description:
        'Notaður sem texti í skrefum á hliðarstiku þegar gæslu/farbann/vistun er virk',
    },
    restrictionOver: {
      id: 'judicial.system.core:sections.case_results.restriction_over',
      defaultMessage:
        '{caseType, select, ADMISSION_TO_FACILITY {Vistun á stofnun} TRAVEL_BAN {Farbanni} other {Gæsluvarðhaldi}} lokið',
      description:
        'Notaður sem texti í skrefum á hliðarstiku þegar gæslu/farbann/vistun er lokið',
    },
    result: {
      id: 'judicial.system.core:sections.case_results.result',
      defaultMessage: 'Niðurstaða',
      description: 'Notaður sem titill í hliðarstiku í niðurstöðum',
    },
    rejectedV2: {
      id: 'judicial.system.core:sections.case_results.rejected_v2',
      defaultMessage:
        'Kröfu {isInvestigationCase, select, true {um rannsóknarheimild } other {}}hafnað',
      description:
        'Notaður sem texti í skrefum á hliðarstiku þegar kröfu er hafnað',
    },
    investigationAccepted: {
      id: 'judicial.system.core:sections.case_results.investigation_accepted',
      defaultMessage: 'Krafa um rannsóknarheimild samþykkt',
      description:
        'Notaður sem texti í skrefum á hliðarstiku þegar kröfu er samþykkt',
    },
    indictmentClosed: {
      id: 'judicial.system.core:sections.case_results.indictment_closed',
      defaultMessage: 'Máli lokið',
      description:
        'Notaður sem texti í skrefum á hliðarstiku þegar máli er lokið',
    },
  }),
}
