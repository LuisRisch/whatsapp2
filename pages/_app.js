import '../styles/globals.css'
import { UserContextProvider } from '../store/user-context'

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  )
}

export default MyApp
