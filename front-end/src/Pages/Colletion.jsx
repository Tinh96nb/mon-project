import Portfolio from 'Components/Portfolio'
import UserDetails from 'Components/UserDetails'
import CollectionHero from 'Components/UI/CollectionHero'

export default function Home() {
  return (
    <>
      <UserDetails />
      <CollectionHero />
      <Portfolio />
    </>
  )
}
