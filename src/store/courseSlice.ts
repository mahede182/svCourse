import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CourseSortOption = 'title_asc' | 'title_desc' | 'newest' | 'rating_desc' | 'price_asc' | 'price_desc' | 'duration_desc';
export type PremiumFilter = 'all' | 'premium' | 'free';

export interface CourseState {
  searchQuery: string;
  isEnrolledFilter: boolean;
  premiumFilter: PremiumFilter;
  sortOption: CourseSortOption;
}

const initialState: CourseState = {
  searchQuery: '',
  isEnrolledFilter: false,
  premiumFilter: 'all',
  sortOption: 'newest',
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    toggleEnrolledFilter(state) {
      state.isEnrolledFilter = !state.isEnrolledFilter;
    },
    setPremiumFilter(state, action: PayloadAction<PremiumFilter>) {
      state.premiumFilter = action.payload;
    },
    setSortOption(state, action: PayloadAction<CourseSortOption>) {
      state.sortOption = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setSearchQuery, toggleEnrolledFilter, setPremiumFilter, setSortOption, resetFilters } = courseSlice.actions;
export default courseSlice.reducer;
