import type { AppSyncAuthorizerHandler } from 'aws-lambda'

export const handler: AppSyncAuthorizerHandler = async event => {
  console.log(`EVENT: ${JSON.stringify(event)}`)
  return {
    isAuthorized: true,
  }
}
