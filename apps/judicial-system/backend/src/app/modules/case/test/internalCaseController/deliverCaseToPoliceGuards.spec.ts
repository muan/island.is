import { CanActivate } from '@nestjs/common'

import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseCompletedGuard } from '../../guards/caseCompleted.guard'
import { InternalCaseController } from '../../internalCase.controller'
import { CaseTypeGuard } from '../../guards/caseType.guard'

describe('InternalCaseController - Deliver case to police guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      InternalCaseController.prototype.deliverCaseToPolice,
    )
  })

  it('should have three guards', () => {
    expect(guards).toHaveLength(3)
  })

  describe('CaseExistsGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have CaseExistsGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(CaseExistsGuard)
    })
  })

  describe('CaseTypeGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = guards[1]
    })

    it('should have CaseTypeGuard as quard 2', () => {
      expect(guard).toBeInstanceOf(CaseTypeGuard)
      expect(guard).toEqual({
        allowedCaseTypes: [...restrictionCases, ...investigationCases],
      })
    })
  })

  describe('CaseCompletedGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[2]()
    })

    it('should have CaseCompletedGuard as quard 3', () => {
      expect(guard).toBeInstanceOf(CaseCompletedGuard)
    })
  })
})
