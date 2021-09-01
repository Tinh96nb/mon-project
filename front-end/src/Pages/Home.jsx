import { useEffect } from 'react'
import HomeWelcome from '../Components/HomeWelcome'
import Portfolio from '../Components/Portfolio'
import Creators from '../Components/Creators'
import { useSelector } from 'react-redux'

export default function Home () {
  const res = useSelector((state)=> state)
  useEffect(() => {
    console.log('init');
  }, [])
  return (
    <>
      <HomeWelcome />
      <Creators />
      <Portfolio />
    </>
  )
}
