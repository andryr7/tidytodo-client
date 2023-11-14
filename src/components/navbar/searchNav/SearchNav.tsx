import { AppContext } from '@data/context';
import { SearchActionKind } from '@data/reducer';
import { CloseButton, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SearchNav() {
  const { state, dispatch } = useContext(AppContext);
  const [bouncingSearchInput, setBouncingSearchInput] = useState(state.searchInput);
  const [debouncedSearchInput] = useDebouncedValue(bouncingSearchInput, 250);
  const navigate = useNavigate();

  //Using debounced search input to update state, which will update search results
  //TODO Fix dependency array eslint warning
  useEffect(() => {
    dispatch({
      type: SearchActionKind.SET_SEARCH_INPUT,
      payload: { searchInput: debouncedSearchInput }
    });
  }, [debouncedSearchInput, dispatch]);

  //Handling immediate search input state change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBouncingSearchInput(e.target.value);
  };

  //Switching to search app mode when focusing the search input
  const handleSearchInputFocus = () => {
    navigate('/search');
  };

  const handleClearSearchButtonClick = () => {
    setBouncingSearchInput('');
    handleSearchInputFocus();
  };

  return (
    <TextInput
      placeholder="Search"
      size="md"
      icon={<IconSearch size="0.8rem" stroke={1.5} />}
      mb="sm"
      value={bouncingSearchInput}
      onChange={handleSearchInputChange}
      onFocus={handleSearchInputFocus}
      rightSection={<CloseButton onClick={handleClearSearchButtonClick} />}
    />
  );
}
