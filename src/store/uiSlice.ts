import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SortOption = 'title_asc' | 'title_desc' | 'newest';

interface UiState {
  searchQuery: string;
  isEnrolledFilter: boolean;
  sortOption: SortOption;
}

const initialState: UiState = {
  searchQuery: '',
  isEnrolledFilter: false,
  sortOption: 'newest',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    toggleEnrolledFilter(state) {
      state.isEnrolledFilter = !state.isEnrolledFilter;
    },
    setSortOption(state, action: PayloadAction<SortOption>) {
      state.sortOption = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setSearchQuery, toggleEnrolledFilter, setSortOption, resetFilters } =
  uiSlice.actions;
export default uiSlice.reducer;
