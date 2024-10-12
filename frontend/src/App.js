import React from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import Dropdown from './components/Dropdown/Dropdown';
import ButtonGroup from './components/Button/Button';

const App = () => {
  const options = [
    { value: 'option1', label: 'Опция 1' },
    { value: 'option2', label: 'Опция 2' },
    { value: 'option3', label: 'Опция 3' },
  ];

  const handleSearch = (term) => {
    console.log(`Поиск по запросу: ${term}`);
  };

  const handleSelect = (option) => {
    console.log(`Выбрана опция: ${option.label}`);
  };

  const handleOutlinedButtonClick = () => {
    alert('Полая кнопка нажата!');
  };

  const handleFilledButtonClick = () => {
    alert('Заполненная кнопка нажата!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Мое приложение</h1>

      {/* Компонент строки поиска */}
      <SearchBar onSearch={handleSearch} />

      {/* Компонент выпадающего списка */}
      <Dropdown options={options} onSelect={handleSelect} />

      {/* Компонент группы кнопок */}
      <ButtonGroup 
        onOutlinedClick={handleOutlinedButtonClick} 
        onFilledClick={handleFilledButtonClick} 
      />

      {/* Другие элементы вашего приложения могут быть добавлены здесь */}
    </div>
  );
};

export default App;