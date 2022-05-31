import Document, { Html, Head, Main, NextScript } from 'next/document'



class MyDocument extends Document {
    render() {
        return (
            <Html lang='en'>
                <Head>
                    <meta name="description" content="Dev Minh Ecommerce website" />
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"></link>
                    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" ></script>
                    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" ></script>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js"></script>

                    <script src="https://kit.fontawesome.com/f8155f2950.js" ></script>
                </Head>
                <body >
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
export default MyDocument