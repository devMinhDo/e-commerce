import '../styles/globals.css';


import Layout from '../Components/Layout'
import { DataProvider } from '../store/GlobalState'
function MyApp({ Component, pageProps }) {
  console.log(Component, pageProps)
  return (
    <>
    
      <DataProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DataProvider>
      
      </>
  )
}

export default MyApp
