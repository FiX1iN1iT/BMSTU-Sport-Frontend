import { useDispatch, useSelector } from 'react-redux';
import { setSearchValue } from '../redux/searchSlice';
import { RootState } from "../redux/store";
import SearchField from './SearchField';

export const SearchComponent = () => {
  const dispatch = useDispatch();
  const { searchValue } = useSelector((state: RootState) => state.search);

  return (
    <SearchField
      value={searchValue}
      setValue={(value) => dispatch(setSearchValue(value))}
      placeholder="Поиск по названию"
    />
  );
};
