// src/pages/search_page/SearchPage.jsx

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import SearchBar from '../../components/search_bar/searchBar';
import Button from '../../components/buttons/button';
import RouteCard from '../../components/route_card/routeCard';

import './SearchPage.css'; // Стили, если нужно

const SearchPage = () => {
  const navigate = useNavigate();

  // По дефолту показываем "МАРШРУТЫ"
  const [activeRouteButton, setActiveRouteButton] = useState('МАРШРУТЫ');
  const [activeSortButton, setActiveSortButton] = useState('');

  const [routes, setRoutes] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // При загрузке страницы — подгружаем список маршрутов
    // (или сразу и маршруты, и подборки)
    const fetchData = async () => {
      try {
        // 1) Список маршрутов
        const routesRes = await fetch('http://localhost:8100/api/route/routes');
        const routesData = await routesRes.json();
        const routeIds = routesData.routes || [];

        const routePromises = routeIds.map(async (id) => {
          const detailRes = await fetch(`http://localhost:8100/api/route/route/${id}`);
          const detailData = await detailRes.json();
          const { route } = detailData;
          return {
            id: route.route_id,
            name: route.name,
            description: route.description,
            // ... и т.д.
          };
        });
        const routesResult = await Promise.all(routePromises);
        setRoutes(routesResult);

        // 2) Список подборок (если нужно)
        const collRes = await fetch('http://localhost:8100/api/collection/collections');
        const collData = await collRes.json(); // { collections: [1,2,3,...] }
        const collIds = collData.collections || [];
        const collPromises = collIds.map(async (cId) => {
          const cRes = await fetch(`http://localhost:8100/api/collection/collection/${cId}`);
          const cJson = await cRes.json();
          // cJson содержит информацию о подборке
          return {
            id: cJson.collection.collection_id,
            name: cJson.collection.name,
            description: cJson.collection.description,
            // ... и т.д.
          };
        });
        const collectionsResult = await Promise.all(collPromises);
        setCollections(collectionsResult);

      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
      }
    };

    fetchData();
  }, []);

  // Сброс активных кнопок при клике вне сортировки (пример)
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest('.sort-filter-container')) {
        setActiveSortButton('');
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Клики на кнопки
  const handleRouteButtonClick = (buttonType) => {
    setActiveRouteButton(buttonType);
  };

  const handleSortButtonClick = (buttonType) => {
    setActiveSortButton((prev) => (prev === buttonType ? '' : buttonType));
  };

  // При клике на маршрут — переходим на /route/{id}
  const handleOpenRouteDetail = (routeId) => {
    navigate(`/route/${routeId}`);
  };

  // При клике на подборку — /collection/{id}
  const handleOpenCollectionDetail = (collectionId) => {
    navigate(`/collection/${collectionId}`);
  };

  return (
    <div className="search-page">
      <Helmet>
        <title>33routes - Поиск</title>
      </Helmet>

      {/* Поиск */}
      <SearchBar />

      {/* Кнопки «МАРШРУТЫ» / «ПОДБОРКИ» */}
      <div className="button-groups">
        <div className="type-button-container">
          <Button
            label="МАРШРУТЫ"
            variant={activeRouteButton === 'МАРШРУТЫ' ? 'dark' : 'white'}
            onClick={() => handleRouteButtonClick('МАРШРУТЫ')}
          />
          <Button
            label="ПОДБОРКИ"
            variant={activeRouteButton === 'ПОДБОРКИ' ? 'dark' : 'white'}
            onClick={() => handleRouteButtonClick('ПОДБОРКИ')}
          />
        </div>

        <div className="sort-filter-container">
          <Button
            label="СОРТИРОВАТЬ"
            variant={activeSortButton === 'СОРТИРОВАТЬ' ? 'dark' : 'white'}
            onClick={() => handleSortButtonClick('СОРТИРОВАТЬ')}
          />
          <Button
            label="ФИЛЬТРЫ"
            variant={activeSortButton === 'ФИЛЬТРЫ' ? 'dark' : 'white'}
            onClick={() => handleSortButtonClick('ФИЛЬТРЫ')}
          />
        </div>
      </div>

      {/* Список маршрутов или подборок */}
      <div className="list-content">
        {activeRouteButton === 'МАРШРУТЫ' && (
          <div className="route-list">
            {routes.map((r) => (
              <RouteCard
                key={r.id}
                id={r.id}
                name={r.name}
                description={r.description}
                // при клике – переходим на /route/ID
                onOpenRouteDetail={handleOpenRouteDetail}
              />
            ))}
          </div>
        )}

        {activeRouteButton === 'ПОДБОРКИ' && (
          <div className="collection-list">
            {collections.map((c) => (
              <div
                key={c.id}
                className="collection-item"
                onClick={() => handleOpenCollectionDetail(c.id)}
              >
                <h3>{c.name}</h3>
                <p>{c.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
