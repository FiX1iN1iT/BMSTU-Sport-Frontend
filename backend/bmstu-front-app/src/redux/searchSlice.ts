import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  searchValue: string;
}

const loadSearchValueFromLocalStorage = () => {
    const searchState = localStorage.getItem('search');
    return searchState ? JSON.parse(searchState) : {};
  };
  
  const saveSearchValuesToLocalStorage = (searchState: SearchState) => {
    localStorage.setItem('search', JSON.stringify(searchState));
  };
  
  const initialState: SearchState = loadSearchValueFromLocalStorage(); // Загрузка из localStorage
  
  const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchValue(state, action: PayloadAction<string>) {
        state.searchValue = action.payload;
        saveSearchValuesToLocalStorage(state); // Сохранение в localStorage
      },
      resetSearch(state) {
        state.searchValue = '';
        saveSearchValuesToLocalStorage(state);
      }
    }
  });
  
  export const { setSearchValue, resetSearch } = searchSlice.actions;
  export default searchSlice.reducer;