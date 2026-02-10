import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { ProjDevCardsRow } from '../components/ProjDevCards';
import FontSizeControl from '../components/FontSizeControl';

export default function Hello() {
  return (
    <Layout title="मुखपृष्ठ" description="मुखपृष्ठ">
        <br/>
        <center>
        <h1>संपूर्ण संग्रह</h1>
        <img id='bappa' src='/img/ico.png'/>
        <div className="container">
        <ProjDevCardsRow/>
        </div>
          </center>

        <FontSizeControl />

    </Layout>
  );
}