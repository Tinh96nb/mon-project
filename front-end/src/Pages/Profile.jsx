import Portfolio from 'Components/Portfolio'
import HeadProfile from 'Components/UI/HeadProfile'
import { useSelector } from 'react-redux'

export default function Home() {

  const {me} = useSelector((store) => store.user)
  return (
    <>
      <HeadProfile user={me}/>
      <Portfolio />
    </>
  )
}
