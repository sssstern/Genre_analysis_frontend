import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';

const pathMap: { [key: string]: string } = {
  'services': 'Список Услуг',
};

const CustomBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs = [{ name: 'Главная', path: '/' }];
  let currentPath = '';

  pathnames.forEach((value, index) => {
    currentPath += `/${value}`;
    const name = pathMap[value] || value;
    
    if (index === pathnames.length - 1 && !pathMap[value]) {
        breadcrumbs.push({ name: `Детали (${name})`, path: currentPath });
    } else {
        breadcrumbs.push({ name: name, path: currentPath });
    }
  });

  return (
    <Breadcrumb className="mt-3">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <Breadcrumb.Item 
            key={crumb.path}
            active={isLast}
            linkAs={isLast ? undefined : Link}
            linkProps={isLast ? {} : { to: crumb.path }}
          >
            {crumb.name}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default CustomBreadcrumbs;