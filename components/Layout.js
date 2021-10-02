import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import Head from 'next/head';

const Layout = ({children}) => {
    return (
        <Container>
            <Head>
            <link href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" rel="stylesheet" />
            </Head>
            <Header></Header>
            {
                children
            }
            
        </Container>
    );
};

export default Layout;