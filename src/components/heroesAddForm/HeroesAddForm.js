import { useState } from "react";
import { selectAll } from "../heroesFilters/filterSlice";
import { heroCreated } from "../heroesList/heroesSlice";
import { useDispatch, useSelector } from "react-redux";
import { v1 } from "uuid";
import { useHttp } from "../../hooks/http.hook"
// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров


const HeroesAddForm = () => {
    const [name, setName] = useState();
    const [description, setDescr] = useState();
    const [element, setElement] = useState();
    const filters = useSelector(selectAll)
    const dispatch = useDispatch()
    const {request} = useHttp();

    const onSubmit  = (e) => {
        e.preventDefault()
        const newHero = {id: v1(), name, description, element}
        dispatch(heroCreated(newHero))
        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(data => console.log(data))
        setName('')
        setElement('')
        setDescr('')
    }

    const onChange = (e) => {
        setName(e.target.value) 
    }

    const textAreaChange = (e) => {
        setDescr(e.target.value)
    }
    const elementChange = (e) => {
        setElement(e.target.value)
    }


    return (
        <form onSubmit={onSubmit} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    onChange={onChange} 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={name}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    onChange={textAreaChange}
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={description}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    onChange={elementChange}
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={element}>
                    <option >Я владею элементом...</option>
                    {filters.map(({name,text}, i) => name !== 'all' ? <option key={i} value={name}>{text}</option> : null)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;
