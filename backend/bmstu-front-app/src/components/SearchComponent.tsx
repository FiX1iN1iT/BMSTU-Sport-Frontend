import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchValue } from '../redux/searchSlice'; // Импортируем действия
import { RootState } from "../redux/store";
import SearchField from './SearchField'; // Импортируем ваш компонент поля поиска

interface SearchComponentProps {
    onSearchValueChange: (searchValue: string) => void;
}

export const SearchComponent = ({
    // onSearchValueChange
}) => {
  const dispatch = useDispatch();
  const { searchValue } = useSelector((state: RootState) => state.search);

//   const handleSearch = () => {
//     dispatch(setSearchValue(searchValue));
//     onSearchValueChange(searchValue);
//     console.log("seaching for: ", searchValue)
//   };

//   const handleSubmit = () => {
//     onSearchValueChange(searchValue);
//   };

  return (
    <SearchField
      value={searchValue}
      setValue={(value) => dispatch(setSearchValue(value))}
      placeholder="Поиск по названию"
    //   onSubmit={handleSubmit}
    />
  );
};
