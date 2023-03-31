import getConfig from 'next/config'

const defaultParams = {
  sourceLanguageCode: 'is',
  targetLanguageCode: 'en',
}

async function translateTexts(texts: string[]) {
  const { publicRuntimeConfig } = getConfig()
  const baseUrl = publicRuntimeConfig.MIDEIND_TRANSLATION_API_BASE_URL

  const translations = []
  const body = {
    contents: texts,
    ...defaultParams,
  }

  const response = await fetch(`${baseUrl}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': publicRuntimeConfig.MIDEIND_TRANSLATION_API_KEY,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json())

  for (const translation of response.translations) {
    translations.push(translation.translatedText.trim())
  }

  return translations
}

async function sendTexts(
  iceTexts: string[],
  enTexts: string[],
  reference: string,
) {
  const { publicRuntimeConfig } = getConfig()
  const baseUrl = publicRuntimeConfig.MIDEIND_TRANSLATION_API_BASE_URL

  const body = {
    machineTranslatedText: '', // Required even if empty
    translationReference: 1 || reference, // Reference to be accepted later by Miðeind
    originalText: iceTexts.join(' '), // String expected, not array
    correctedText: enTexts.join(' '), // String expected, not array
    languagePair: 'is-en',
    model: 'transformer-base',
  }

  const response = await fetch(`${baseUrl}/corrected`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': publicRuntimeConfig.MIDEIND_TRANSLATION_API_KEY,
    },
    body: JSON.stringify(body),
  })
}

export { translateTexts, sendTexts }
