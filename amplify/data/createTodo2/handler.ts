import type { Schema } from '../resource'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { env } from '$amplify/env/createTodo2'
import { createTodo, createUser } from '../../graphql/mutations.js'

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
        region: env.AWS_REGION,
        defaultAuthMode: 'iam',
      },
    },
  },
  {
    Auth: {
      credentialsProvider: {
        getCredentialsAndIdentityId: async () => ({
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            sessionToken: env.AWS_SESSION_TOKEN,
          },
        }),
        clearCredentialsAndIdentityId: () => {
          /* noop */
        },
      },
    },
  }
)

const client = generateClient<Schema>({
  authMode: 'iam',
})

export const handler: Schema['createTodo2']['functionHandler'] = async (
  event,
  context
) => {
  try {
    const userResult = await client.graphql({
      query: createUser,
      variables: {
        input: {
          name: 'Test',
        },
      },
    })

    console.log('userResult', userResult)

    const result = await client.graphql({
      query: createTodo,
      variables: {
        input: {
          content: 'A todo',
          userId: userResult.data.createUser.id,
        },
      },
    })

    console.log('result', result)
  } catch (error: any) {
    console.error('error', error)
  }
}
