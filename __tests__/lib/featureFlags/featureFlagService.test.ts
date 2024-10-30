import {
  FeatureFlagService,
  createFeatureFlagService,
} from '@/lib/featureFlags/featureFlagService'
import { InMemoryFeatureFlagService } from '@/lib/featureFlags/inMemoryFeatureFlagService'
import { describe, expect, it } from 'vitest'

describe('createFeatureFlagService', () => {
  it('should return an instance of InMemoryFeatureFlagService for provider "memory"', () => {
    const service: FeatureFlagService = createFeatureFlagService('memory')

    expect(service).toBeInstanceOf(InMemoryFeatureFlagService)
  })

  it('should throw an error for an unsupported provider', () => {
    expect(() => createFeatureFlagService('unsupported' as never)).toThrowError(
      'Unsupported provider: unsupported',
    )
  })
})
