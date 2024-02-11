import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { useGetHeroesQuery } from '../../api/apiSlice';
import { useDeleteHeroMutation } from '../../api/apiSlice';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const {
        data: heroes = [],
        isLoading,
        isError,
    } = useGetHeroesQuery()

    const compare = (a,b) => {
        if (a.name < b.name) {
            return -1
        }
        if (a.name > b.name) {
            return 1
        }
        return 0
    }

    const [deleteHero] = useDeleteHeroMutation();

    const activeFilter = useSelector(state => state.filters.activeFilter)
    const heroSortedStatus = useSelector(state => state.heroes.heroSortedStatus)

    const filteredHeroes =  useMemo(() => {
        const filteredHeroes = heroes.slice()

        if(activeFilter === 'all') {
            return filteredHeroes
        } else {
            return filteredHeroes.filter(item => item.element === activeFilter)
        }
    }, [heroes, activeFilter])

    const sortedHeroes = useMemo(() => {

        if (heroSortedStatus) {
            return filteredHeroes.toSorted(compare)
        } else {
            return filteredHeroes
        }
    }, [filteredHeroes, heroSortedStatus])

    if (isLoading) {
        return <Spinner/>;
    } else if (isError) {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map((props) => {
            return <HeroesListItem onDeleteHero={deleteHero} key={props.id} {...props}/>
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