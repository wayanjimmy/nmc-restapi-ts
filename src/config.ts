interface Config {
  port: number
  envName: string
}

interface Environments {
  [env: string]: Config
}

enum EnvironmentType {
  Production = 'production',
  Development = 'development'
}

const environments: Environments = {
  development: {
    port: 3000,
    envName: EnvironmentType.Development
  },
  production: {
    port: 5000,
    envName: EnvironmentType.Production
  }
}

const currentEnvironment = (process.env.NODE_ENV as string).toLowerCase() || EnvironmentType.Development

const environmentToExport = environments[currentEnvironment]

export default environmentToExport
