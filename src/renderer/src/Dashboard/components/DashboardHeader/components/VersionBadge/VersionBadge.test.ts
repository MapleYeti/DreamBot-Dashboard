import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Test utility to verify VersionBadge displays the correct version from package.json
 * Run with: node -r ts-node/register VersionBadge.test.ts
 */

function runVersionBadgeTests(): void {
  console.log('🧪 Running VersionBadge tests...\n')

  try {
    // Test 1: Check if VersionBadge displays correct version from package.json
    const packageJsonPath = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    const expectedVersion = `v${packageJson.version}`

    // Read the VersionBadge component source
    const versionBadgePath = join(
      process.cwd(),
      'src/renderer/src/Dashboard/components/DashboardHeader/components/VersionBadge/VersionBadge.tsx'
    )
    const versionBadgeSource = readFileSync(versionBadgePath, 'utf8')

    // Check if the component contains the correct version
    const versionRegex = /v\d+\.\d+\.\d+/
    const match = versionBadgeSource.match(versionRegex)

    if (!match) {
      throw new Error('❌ No version found in VersionBadge component')
    }

    if (match[0] !== expectedVersion) {
      throw new Error(`❌ Version mismatch: Expected ${expectedVersion}, found ${match[0]}`)
    }

    console.log(`✅ Version sync test passed: ${expectedVersion}`)

    // Test 2: Validate semantic version format in package.json
    const semverRegex = /^\d+\.\d+\.\d+$/
    if (!packageJson.version.match(semverRegex)) {
      throw new Error(`❌ Invalid semantic version format: ${packageJson.version}`)
    }

    console.log(`✅ Semantic version format test passed: ${packageJson.version}`)

    console.log('\n🎉 All tests passed!')
  } catch (error) {
    console.error('\n💥 Test failed:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runVersionBadgeTests()
}

export { runVersionBadgeTests }
