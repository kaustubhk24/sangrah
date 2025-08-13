

import React, { JSX } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

const ProjDevCards = [

  
  {
    name: 'चिन्हांकित पाने',
    image: '',
    url: {
      page: '/bookmarks',
    },
    description: (
      <span>तुम्ही चिन्हांकित केलेली सर्व पाने </span>
    )
    
  },
  {
    name: 'आरती संग्रह',
    image: '',
    url: {
      page: '/category/आरती-संग्रह',
    },
    description: (
      <span>सर्व आरत्या</span>
    )
    
  },

  {
    name: 'स्तोत्र / श्लोक संग्रह',
    image: '',
    url: {
      page: '/category/स्तोत्र--श्लोक-संग्रह',
    },
    description: (
      <span>सर्व स्तोत्र / श्लोक</span>
    )
    
  },
  {
    name: 'अष्टक संग्रह',
    image: '',
    url: {
      page: '/category/अष्टक-संग्रह',
    },
    description: (
      <span>सर्व अष्टके</span>
    )
    
  },
  {
    name: 'चालीसा संग्रह',
    image: '',
    url: {
      page: 'category/चालीसा-संग्रह',
    },
    description: (
      <span>चालीसा</span>
    )
    
  },
  {
    name: 'नामावली संग्रह',
    image: '',
    url: {
      page: '/category/नामावली',
    },
    description: (
      <span>नामावली</span>
    )
    
  },
  {
    name: 'पूजा / व्रत',
    image: '',
    url: {
      page: '/category/पूजा--व्रत',
    },
    description: (
      <span>पूजा</span>
    )
    
  },
  {
    name: 'सूक्त संग्रह',
    image: '',
    url: {
      page: '/category/सूक्त-संग्रह',
    },
    description: (
      <span>सूक्त</span>
    )
    
  },
 
  {
    name: 'पोथी संग्रह',
    image: '',
    url: {
      page: '/category/पोथी',
    },
    description: (
      <span>पोथी</span>
    )
    
  },
  {
    name: 'अभंग संग्रह',
    image: '',
    url: {
      page: '/category/अभंग-संग्रह',
    },
    description: (
      <span>संग्रह</span>
    )
    
  },
 
  {
    name: 'मंगलाष्टका संग्रह',
    image: '',
    url: {
      page: '/category/मंगलाष्टका',
    },
    description: (
      <span>मंगलाष्टका</span>
    )
    
  },
 
  {
    name: 'कथा संग्रह',
    image: '',
    url: {
      page: '/category/कथा-संग्रह',
    },
    description: (
      <span>कथा संग्रह</span>
    )
    
  },
  {
    name: 'पाळणा संग्रह',
    image: '',
    url: {
      page: '/category/पाळणा-संग्रह',
    },
    description: (
      <span>पाळणा संग्रह</span>
    )
    
  },
    {
    name: 'जप',
    image: '',
    url: {
      page: '/counter',
    },
    description: (
      <span>जप संख्या</span>
    )
    
  },
{
    name: 'प्रकल्प',
    image: '',
    url: {
      page: '/project-information',
    },
    description: (
      <span>प्रकल्पाविषयी माहिती</span>
    )
    
  },
  {
    name: 'आजचे पंचांग',
    image: '',
    url: {
      page: 'https://dinank.datepanchang.in',
    },
    description: (
      <span>सौजन्य - दाते पंचांग </span>
    )
    
  },



];

interface Props {
  name: string;
  image: string;
  url: {
    page?: string;
    codepen?: string;
  };
  description: JSX.Element;
}

function ProjDevCard({ name, image, url, description }: Props) {
  return (
    <div className="col col--4 margin-bottom--lg">
      <div className={clsx('card card  cardContainer_node_modules-@docusaurus-theme-classic-lib-theme-DocCard-styles-module')}>
        <center>
        <div className={clsx('card__imge')}>
          <Link to={url.page}>
          <div className="card__body">
          <h3 className={clsx('title_kItE')}>{name}</h3>
          <p className={clsx('desc')}>{description}</p>
        </div>
          </Link>
        </div>
        </center>

       
        {/* <div className="card__footer">
          <div className="button-group button-group--block">
          
          </div>
        </div> */}
      </div>
      
    </div>
    
  );
}

export function ProjDevCardsRow(): JSX.Element {
  return (
    <div className="row">
      {ProjDevCards.map((special) => (
        <ProjDevCard key={special.name} {...special} />
      ))}
      
    </div>
    
  );
}
