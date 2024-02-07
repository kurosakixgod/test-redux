import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook'

const filtersAdapter = createEntityAdapter()

export const fetchFilters = createAsyncThunk(
    'fetch/fetchFilters',
    () => {
        const {request} = useHttp();
        return request('http://localhost:3001/filters')
    }
)

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all',
})

const filtersSlice = createSlice({
    name:'filters',
    initialState,
    reducers: { 
        activeFilterChanged: (state, action) => {state.activeFilter = action.payload}
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
            .addCase(fetchFilters.rejected, state => {state.filtersLoadingStatus = 'error'})
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle'
                filtersAdapter.setAll(state, action.payload)
            })
            .addDefaultCase(() => {})
    }
})


const {actions, reducer} = filtersSlice;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters)

export default reducer
export const {
    activeFilterChanged
} = actions