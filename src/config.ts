interface Config {
  envName: string
  httpPort: number
  httpsPort: number
}

interface Environments {
  [env: string]: Config
}

enum EnvironmentType {
  Production = 'production',
  Development = 'development'
}

const environments: Environments = {
  [EnvironmentType.Development]: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: EnvironmentType.Development
  },
  [EnvironmentType.Production]: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: EnvironmentType.Production
  }
}

const currentEnvironment = (process.env.NODE_ENV as string).toLowerCase() || EnvironmentType.Development

const environmentToExport = environments[currentEnvironment]

export default environmentToExport
