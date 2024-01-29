"use client";
import { cookies } from 'next/headers'
import LandingPage from './(landing)/page';

async function getCookieData() {
  const cookieData = cookies().getAll()
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData)
    }, 1000)
  )
}

export default async function Home() {
  const cookieData = await getCookieData()
  return (
    <LandingPage/>
  );
}
