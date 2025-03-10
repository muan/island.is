import { uuid } from 'uuidv4'
import { Op } from 'sequelize'

import { NotFoundException } from '@nestjs/common'

import { CaseState, UserRole } from '@island.is/judicial-system/types'

import { nowFactory, uuidFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { User } from '../../../user'
import { DefendantService } from '../../../defendant'
import { Case } from '../../models/case.model'
import { createTestingCaseModule } from '../createTestingCaseModule'

jest.mock('../../../factories')

interface Then {
  result: User
  error: Error
}

type GivenWhenThen = (nationalId: string) => Promise<Then>

describe('LimitedAccessCaseController - Find defender by national id', () => {
  const date = randomDate()
  const defenderId = uuid()
  const defenderNationalId = '1234567890'
  const defenderName = 'John Doe'
  const defenderPhoneNumber = '1234567'
  const defenderEmail = 'dummy@dummy.dy'

  let mockDefendantService: DefendantService
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      defendantService,
      caseModel,
      limitedAccessCaseController,
    } = await createTestingCaseModule()

    mockDefendantService = defendantService
    mockCaseModel = caseModel

    const mockFindLatestDefendantByDefenderNationalId = mockDefendantService.findLatestDefendantByDefenderNationalId as jest.Mock
    mockFindLatestDefendantByDefenderNationalId.mockResolvedValue(null)
    const mockFindOne = mockCaseModel.findOne as jest.Mock
    mockFindOne.mockResolvedValue(null)
    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockId = uuidFactory as jest.Mock
    mockId.mockReturnValueOnce(defenderId)

    givenWhenThen = async (nationalId: string) => {
      const then = {} as Then

      try {
        then.result = await limitedAccessCaseController.findDefenderByNationalId(
          nationalId,
        )
      } catch (error) {
        then.error = error as Error
      }
      return then
    }
  })

  describe('defender not found', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(defenderNationalId)
    })

    it('should look for defender', () => {
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        where: {
          defenderNationalId,
          state: { [Op.not]: CaseState.DELETED },
          isArchived: false,
        },
        order: [['created', 'DESC']],
      })
      expect(
        mockDefendantService.findLatestDefendantByDefenderNationalId,
      ).toHaveBeenCalledWith(defenderNationalId)
    })

    it('should throw an error', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`Defender not found`)
    })
  })

  describe('defender found in a case', () => {
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce({
        defenderNationalId,
        defenderName,
        defenderPhoneNumber,
        defenderEmail,
      })

      then = await givenWhenThen(defenderNationalId)
    })

    it('should return the user', () => {
      expect(then.result).toEqual({
        id: defenderId,
        created: date,
        modified: date,
        nationalId: defenderNationalId,
        name: defenderName,
        title: 'verjandi',
        mobileNumber: defenderPhoneNumber,
        email: defenderEmail,
        role: UserRole.DEFENDER,
        active: true,
      })
    })
  })

  describe('defender found in a defendant', () => {
    let then: Then

    beforeEach(async () => {
      const mockFindLatestDefendantByDefenderNationalId = mockDefendantService.findLatestDefendantByDefenderNationalId as jest.Mock
      mockFindLatestDefendantByDefenderNationalId.mockResolvedValueOnce({
        defenderNationalId,
        defenderName,
        defenderPhoneNumber,
        defenderEmail,
      })

      then = await givenWhenThen(defenderNationalId)
    })

    it('should return the user', () => {
      expect(then.result).toEqual({
        id: defenderId,
        created: date,
        modified: date,
        nationalId: defenderNationalId,
        name: defenderName,
        title: 'verjandi',
        mobileNumber: defenderPhoneNumber,
        email: defenderEmail,
        role: UserRole.DEFENDER,
        active: true,
      })
    })
  })
})
