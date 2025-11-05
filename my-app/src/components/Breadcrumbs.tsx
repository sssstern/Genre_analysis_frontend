import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';

const pathMap: { [key: string]: string } = {
  'services': 'Список Услуг',
};

const CustomBreadcrumbs: React.FC = () => {
  const location = useLocation();
  // Разделяем путь и убираем пустые элементы (первый '/')
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs = [{ name: 'Главная', path: '/' }];
  let currentPath = '';

  pathnames.forEach((value, index) => {
    currentPath += `/${value}`;
    const name = pathMap[value] || value; // Если это ID, то будет сам ID
    
    // 💡 Логика: если это последний элемент и он не в карте (т.е. ID), это Детали
    if (index === pathnames.length - 1 && !pathMap[value]) {
        // Здесь можно сделать запрос на получение имени по ID, но для простоты используем ID
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