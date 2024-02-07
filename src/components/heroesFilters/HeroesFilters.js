import {useHttp} from '../../hooks/http.hook'
import { heroesSorted } from '../heroesList/heroesSlice';
import { activeFilterChanged, fetchFilters, selectAll } from './filterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import Spinner from '../spinner/Spinner'
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const {heroSortedStatus} = useSelector(state => state.heroes)
    const {filtersLoadingStatus} = useSelector(state => state.filters)
    const filters = useSelector(selectAll)
    const dispatch = useDispatch()
    const {request} = useHttp();

    const setColor = (element) => {
        switch(element) {
            case 'all':
                return 'btn btn-outline-dark active'
            case 'fire':
                return 'btn btn-danger'
            case 'water':
                return 'btn btn-primary'
            case 'earth':
                return 'btn btn-secondary'
            case 'wind':
                return 'btn btn-success'
            default:
                return 'btn'
        }
    }

    const activeRefList = useRef([])
    const onFocus = (id) => {
        activeRefList.current.forEach(item => item.classList.remove('active'));
        activeRefList.current[id].classList.add('active');
        activeRefList.current[id].focus();
    }

    useEffect(() => {
        dispatch(fetchFilters(request))
        // eslint-disable-next-line
    }, [])
    
    if (filtersLoadingStatus === 'loading') {
        return <Spinner/>
    } else if (filtersLoadingStatus === 'error') {
        return <h5 className='text-center mt-5'>Ошибка загрузки</h5>
    }
    
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text"></p>
                <button style={{marginBottom: "10px"}} onClick={() => dispatch(heroesSorted())} className='btn btn-primary'>{heroSortedStatus ? 'Отменить сортировку' : 'Сортировать по алфавиту' }</button>
                <div className="btn-group mt10">
                    {filters.map(({name, text}, i) => <button 
                                                        onClick={() => {
                                                            onFocus(i)
                                                            dispatch(activeFilterChanged(name))
                                                        }}
                                                        ref={(el) => activeRefList.current[i] = el }
                                                        key={name}
                                                        value={name} 
                                                        className={setColor(name)}>{text}</button>)}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;