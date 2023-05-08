import { useEffect, useState } from 'react';
import './TodoListItem.css';
import { FaCheckCircle, FaRegCircle} from "react-icons/fa";
import axios from 'axios';
import TodoUpdate from './TodoUpdate';

function TodoList() {

    const [todoList, setTodoList] = useState([]);
    const [todoName, setTodoName] = useState('');
    const [todoId, setTodoId] = useState(0);
    const handlerChangeTodoName = e => setTodoName(e.target.value);


    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/${habitIdx}`)
            .then(response => {
                setTodoList(response.data);
            })
            .catch(error => console.log(error));
    }, []);


        // 해당 달의 말일 구하기
        const createCircle = () => {
            const newDate = new moment(date, 'YYYY-MM-DD').format('YYYYMMDD');
            let year = newDate.substring(0, 3);
            // setYear(year);
            let month = parseInt(newDate.substring(4, 5));
            let lastDate = new Date(year, month, 0);
            let lastDay = lastDate.getDate();
            alert(lastDay);
            let arr = [];
            for (let i = 1; i < lastDay; i++) {
                arr.push(
    
                    <div className='habit_detail_content_circle'>
                        <button type="button" value={i} onClick={() => handlerClick(i)}>{i}</button>
                    </div>
                )
            }
            return arr;
        }


    const handlerCheck = (todoId) => () => {
        axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/ondayschedule/completetodocheck/${todoId}`, { todoId })
            .then(response => {
                setTodoList(prevList => prevList.map(todo => {
                    if (todo.todoId === todoId) {
                        return { ...todo, todoComplete: true };
                    } else {
                        return todo;
                    }
                }));
            })
            .catch(error => {
                console.log(error);
                return;
            });
    }

    const handlerUncheck = (todoId) => () => {
        axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/ondayschedule/completetodouncheck/${todoId}`, { todoId })
            .then(response => {
                setTodoList(prevList => prevList.map(todo => {
                    if (todo.todoId === todoId) {
                        return { ...todo, todoComplete: false };
                    } else {
                        return todo;
                    }
                }));
            })
            .catch(error => {
                console.log(error);
                return;
            });
    }


    return (
        <>
            {todoList && todoList.map(todo => (
                <>
                    <div className="TodoList">
                        {todo.id}
                        <div className='TodoContainer'>
                            <div className='Todo-box'></div>
                            <div className="TodoListItem">
                                <div className='checkBox'>
                                    {todo.todoComplete == true ?
                                        <FaCheckCircle className='checkBoxbutton' onClick={handlerUncheck(todo.todoId)} />
                                        : <FaRegCircle className='checkBoxbutton' onClick={handlerCheck(todo.todoId)} />}
                                </div>
                                <TodoUpdate todoName={todo.todoName} todoId={todo.todoId}></TodoUpdate>
                            </div>
                        </div>
                    </div>

                </>
            ))}
        </>
    );
};


export default TodoList;