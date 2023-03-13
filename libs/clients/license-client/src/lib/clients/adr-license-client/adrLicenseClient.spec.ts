import { LOGGER_PROVIDER } from '@island.is/logging'
import { AdrLicenseClient } from './adrLicenseClient.service'
import { Test, TestingModule } from '@nestjs/testing'
import { AdrApi } from '@island.is/clients/adr-and-machine-license'
import { Pass, SmartSolutionsApi } from '@island.is/clients/smartsolutions'
import { User } from '@island.is/auth-nest-tools'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { FetchError } from '@island.is/clients/middlewares'
import { createAdrLicense } from '../../fixtures/adrLicense.fixture'

const adrPass = {
  distributionQRCode: 'valid_qr',
  distributionUrl: 'valid_url',
}

const validFlattenedAdrLicense = {
  kennitala: '0123456789',
  fulltNafn: 'Test maður',
  skirteinisNumer: '00001',
  faedingardagur: '1930-01-01T00:00:00',
  rikisfang: 'IS',
  gildirTil: '2050-01-01T00:00:00',
  adrRettindi: [
    {
      flokkur: '1.',
      grunn: false,
      tankar: false,
      heiti: 'Sprengifim efni og hlutir.',
    },
    {
      flokkur: '4.1',
      grunn: true,
      tankar: true,
      heiti:
        'Eldfim föst efni, sjálfhvarfandi efni og sprengifim efni í föstu formi sem gerð hafa verið hlutlaus.',
    },
    {
      flokkur: '4.2',
      grunn: true,
      tankar: true,
      heiti: 'Sjálftendrandi efni.',
    },
  ],
}

describe('AdrLicenseClient', () => {
  let adrService: AdrLicenseClient
  let adrApi: AdrApi
  let smartApi: SmartSolutionsApi

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdrLicenseClient,
        {
          provide: LOGGER_PROVIDER,
          useClass: jest.fn(() => ({
            debug: (message: string) => console.log(message),
            warn: () => ({}),
            info: () => ({}),
            error: () => ({}),
          })),
        },
        {
          provide: AdrApi,
          useClass: jest.fn(() => ({
            withMiddleware: jest.fn().mockReturnThis(),
            getAdr: () => ({}),
          })),
        },
        {
          provide: SmartSolutionsApi,
          useClass: jest.fn(() => ({
            generatePkPass: () => ({}),
            verifyPkPass: () => ({}),
          })),
        },
      ],
    }).compile()

    adrService = module.get<AdrLicenseClient>(AdrLicenseClient)
    adrApi = module.get<AdrApi>(AdrApi)
    smartApi = module.get<SmartSolutionsApi>(SmartSolutionsApi)
  })

  it('should be defined', () => {
    expect(adrService).toBeDefined()
  })

  describe('getLicense', () => {
    let user: User
    beforeAll(() => {
      user = createCurrentUser({
        nationalId: '0123456789',
      })
    })
    it('should return a a successful fetch with a valid license', async () => {
      //Arrange
      const adrApiSpy = jest
        .spyOn(adrApi, 'getAdr')
        .mockImplementation(() => Promise.resolve(createAdrLicense({ user })))

      const result = await adrService.getLicense(user)

      expect(adrApiSpy).toHaveBeenCalled()
      expect(result).toEqual({
        ok: true,
        data: validFlattenedAdrLicense,
      })
    })
    it('should return a successful fetch but no license', async () => {
      //Arrange
      const error = await FetchError.buildMock({
        status: 404,
      })
      const adrApiSpy = jest
        .spyOn(adrApi, 'getAdr')
        .mockImplementationOnce(() => {
          throw error
        })

      const result = await adrService.getLicense(user)

      expect(adrApiSpy).toHaveBeenCalled()
      expect(result).toEqual({
        ok: true,
        data: null,
      })
    })
    it('should return a failed fetch with a an error object with code 13', async () => {
      //Arrange
      const error = await FetchError.buildMock({
        status: 403,
      })
      const adrApiSpy = jest
        .spyOn(adrApi, 'getAdr')
        .mockImplementationOnce(() => {
          throw error
        })

      const result = await adrService.getLicense(user)

      expect(adrApiSpy).toHaveBeenCalled()
      expect(result).toMatchObject({
        ok: false,
        error: {
          code: 13,
          message: 'Service failure',
        },
      })
    })
    it('should return a failed fetch with a an error object with code 99', async () => {
      //Arrange
      const adrApiSpy = jest
        .spyOn(adrApi, 'getAdr')
        .mockImplementationOnce(() => {
          throw new Error()
        })

      const result = await adrService.getLicense(user)

      expect(adrApiSpy).toHaveBeenCalled()
      expect(result).toMatchObject({
        ok: false,
        error: {
          code: 99,
          message: 'Unknown error',
        },
      })
    })
  })

  describe('getPkPass', () => {
    it('should return a a successful fetch with a valid pk pass qr code', async () => {
      const user = createCurrentUser({ nationalId: '0123456789' })
      //Arrange
      const adrApiSpy = jest
        .spyOn(adrApi, 'getAdr')
        .mockImplementationOnce(() =>
          Promise.resolve(createAdrLicense({ user })),
        )
      const smartApiSpy = jest
        .spyOn(smartApi, 'generatePkPass')
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            data: (adrPass as unknown) as Pass,
          }),
        )

      const result = await adrService.getPkPassQRCode(user)

      expect(adrApiSpy).toHaveBeenCalled()
      expect(smartApiSpy).toHaveBeenCalled()
      expect(result).toEqual({
        ok: true,
        data: 'valid_qr',
      })
    })
    it('should return a a successful fetch with a valid pk pass url', async () => {
      const user = createCurrentUser({ nationalId: '0123456789' })
      //Arrange
      const adrApiSpy = jest
        .spyOn(adrApi, 'getAdr')
        .mockImplementationOnce(() =>
          Promise.resolve(createAdrLicense({ user })),
        )
      const smartApiSpy = jest
        .spyOn(smartApi, 'generatePkPass')
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            data: (adrPass as unknown) as Pass,
          }),
        )

      const result = await adrService.getPkPassUrl(user)

      expect(adrApiSpy).toHaveBeenCalled()
      expect(smartApiSpy).toHaveBeenCalled()
      expect(result).toEqual({
        ok: true,
        data: 'valid_url',
      })
    })
  })
})
