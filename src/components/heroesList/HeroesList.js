import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { heroDeleted, fetchHeroes, filteredHeroesSelector } from './heroesSlice'
import { createSelector } from '@reduxjs/toolkit';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    // const visibleHeroes = useSelector(filteredHeroesSelector)
    const compare = (a,b) => {
        if (a.name < b.name) {
            return -1
        }
        if (a.name > b.name) {
            return 1
        }
        return 0
    }

    const sortedHeroesSelector = createSelector(
        (state) => state.heroes.heroSortedStatus,
        filteredHeroesSelector,
        (heroSortedStatus, heroes) => {
            if (heroSortedStatus) {
                return heroes.toSorted(compare)
            } else {
                return heroes
            }
        }
    )
    const sortedHeroes = useSelector(sortedHeroesSelector)
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();
    
    const onDeleteHero = (id) => {
        dispatch(heroDeleted(id))   
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(data => console.log(data))
    }

    useEffect(() => {
        dispatch(fetchHeroes(request))
        // eslint-disable-next-line
    }, []);


    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map((props) => {
            return <HeroesListItem onDeleteHero={onDeleteHero} key={props.id} {...props}/>
        })
    }

    const elements = renderHeroesList(sortedHeroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;