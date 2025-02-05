'use server'

import { client } from '@/lib/prisma'

import { currentUser } from '@clerk/nextjs/server';
import { onGetAllAccountDomains } from '../settings';


export const onCompleteUserRegistration = async (
  fullname: string,
  clerkId: string,
  type: string
) => {
  try {
    const registered = await client.user.create({
      data: {
        fullname,
        clerkId,
        type,
        email: '', // Add the email property here
        subscription: {
          create: {},
        },
      },
      select: {
        fullname: true,
        id: true,
        type: true,
      },
    })

    if (registered) {
      return { status: 200, user: registered }
    }
  } catch (error) {
    return { status: 400 }
  }
}

export const onLoginUser = async () => {
  const user = await currentUser()
  if (!user) redirectToSignIn()
  else {
  try {
  const authenticated = await client.user. findUnique({
  where: {
  clerkId: user.id,
  },
  select: {
  fullname: true,
  id: true,
  type: true,
    },
    })
  if (authenticated) {
  const domains = await onGetAllAccountDomains()
  return { status: 200, user: authenticated, domain: domains?.domains }
  }
  } catch (error) {}
  }
}

function redirectToSignIn() {
  throw new Error('Function not implemented.');
}
