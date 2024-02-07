import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";
export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const {request} = useHttp();
        return request('http://localhost:3001/heroes')
    }
    )


const heroesAdapter = createEntityAdapter()
const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle',
    heroSortedStatus: false
})

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroDeleted: (state, action) => {heroesAdapter.removeOne(state, action.payload)},
        heroCreated: (state, action) => {heroesAdapter.addOne(state, action.payload)},
        heroesSorted: (state) => {state.heroSortedStatus = !state.heroSortedStatus}
    },
    extraReducers: (builder) => {   
        builder
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle'
                heroesAdapter.setAll(state, action.payload)
            })
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})
            .addDefaultCase(() => {})
    }
})



const {selectAll} = heroesAdapter.getSelectors(state => state.heroes)

export const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    selectAll,
    (activeFilter, heroes) => {
        if(activeFilter === 'all') {
            console.log('render');
            return heroes
        } else {
            return heroes.filter(item => item.element === activeFilter)
        }
    }
)

const {actions, reducer} = heroesSlice
export default reducer
export const {
    heroCreated,
    heroDeleted,
    heroesSorted
} = actions