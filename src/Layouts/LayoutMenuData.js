import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navdata = () => {
  const navigate = useNavigate();

  const [isMaintenance, setIsMaintenance] = useState(true);
  const [isCategories, setIsCategories] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);

  const [iscurrentState, setIscurrentState] = useState('Maintenance');

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute('subitems')) {
      const ul = document.getElementById('two-column-menu');
      const iconItems = ul.querySelectorAll('.nav-icon.active');
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove('active');
        var id = item.getAttribute('subitems');
        if (document.getElementById(id))
          document.getElementById(id).classList.remove('show');
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove('twocolumn-panel');
    if (iscurrentState !== 'Maintenance') {
      setIsMaintenance(false);
    }
    if (iscurrentState !== 'Categories') {
      setIsCategories(false);
    }
    if (iscurrentState !== 'MuliLevel') {
      setIsMultiLevel(false);
    }
  }, [navigate, iscurrentState, isMaintenance, isCategories, isMultiLevel]);

  const menuItems = [
    {
      label: 'Menu',
      isHeader: true
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: 'mdi mdi-view-grid-plus-outline',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        setIsMaintenance(!isMaintenance);
        setIscurrentState('Maintenance');
        updateIconSidebar(e);
      },
      stateVariables: isMaintenance,
      subItems: [
        {
          id: 1,
          label: 'Products',
          link: '/app/products',
          parentId: 'maintenance'
        },
        {
          id: 2,
          label: 'Categories',
          link: '/app/categories',
          parentId: 'maintenance'
        },
        {
          id: 3,
          label: 'Sizes',
          link: '/app/sizes',
          parentId: 'maintenance'
        },
        {
          id: 4,
          label: 'Brands',
          link: '/app/brands',
          parentId: 'maintenance'
        },
        {
          id: 5,
          label: 'Locations',
          link: '/app/locations',
          parentId: 'maintenance'
        },
        {
          id: 6,
          label: 'Conditions',
          link: '/app/conditions',
          parentId: 'maintenance'
        },
        {
          id: 7,
          label: 'Shelf',
          link: '/app/shelves',
          parentId: 'maintenance'
        },
        {
          id: 7,
          label: 'Seller Types',
          link: '/app/seller-types',
          parentId: 'maintenance'
        },
        {
          id: 7,
          label: 'Quantities',
          link: '/app/quantities',
          parentId: 'maintenance'
        }
      ]
    },
    {
      id: 'categories',
      label: 'Transactions',
      icon: 'mdi mdi-shape-outline',
      link: '/#',
      click: function (e) {
        e.preventDefault();
        setIsCategories(!isCategories);
        setIscurrentState('Categories');
        updateIconSidebar(e);
      },
      stateVariables: isCategories,
      subItems: [
        // {
        //   id: 1,
        //   label: 'Inventory Transfer',
        //   link: '/app/categories',
        //   parentId: 'categories'
        // },
        // {
        //   id: 2,
        //   label: 'Inventory Receiving',
        //   link: '/app/categories/vendors',
        //   parentId: 'categories'
        // },
        {
          id: 3,
          label: 'Stock Adjustments',
          link: '/app/sadj',
          parentId: 'categories'
        },
        // {
        //   id: 4,
        //   label: 'Price Adjustment',
        //   link: '/app/price-adj',
        //   parentId: 'categories'
        // },
        // {
        //   id: 5,
        //   label: 'Withdrawals',
        //   link: '/app/categories/vendors',
        //   parentId: 'categories'
        // },
        {
          id: 6,
          label: 'Stocktake',
          link: '/app/stocktake',
          parentId: 'categories'
        }
      ]
    }
    // {
    //   id: 'reports',
    //   label: 'Reports',
    //   icon: 'mdi mdi-shape-outline',
    //   link: '/#',
    //   click: function (e) {
    //     // e.preventDefault();
    //     // setIsCategories(!isCategories);
    //     // setIscurrentState('Categories');
    //     // updateIconSidebar(e);
    //   },
    //   stateVariables: false
    // }
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
