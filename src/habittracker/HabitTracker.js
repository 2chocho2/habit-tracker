import { MdRemoveCircleOutline } from 'react-icons/md';
import { MdAdd } from 'react-icons/md';
import { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import "./HabitTracker.css";
import chart from "./chart.png"
import before_month from "./before_month.png"
import next_month from "./next_month.png"
import moment from 'moment';
// import cherry1 from "./habit_emoji_1.png"
// import cherry2 from "./habit_emoji_2.png"
import '../chart/habitchart.js';
import Habitchart from '../chart/habitchart.js';



const HabitTracker = () => {

    useEffect(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const newDate = year + "" + month;
        setdefaultMonth(date.getMonth() + 1); // 현재달 변수를 설정
        setchangedMonth(date.getMonth() + 1); // 처음 켜면 현재 달이니까 바뀌는 달도 똑같게
        // alert(defaultmonth)
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/date/${newDate}`)
            .then(response => {
                console.log(response.data);
                setDatas(response.data.list);
                setDate(new Date(new moment(response.data.month, 'YYYY-MM')));
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const { habitIdx } = useParams();
    const [datas, setDatas] = useState([]);
    const [date, setDate] = useState('');
    const [defaultmonth, setdefaultMonth] = useState('') // 달 바꿈을 추적하기 위해서 현재달 변수랑
    const [changedmonth, setchangedMonth] = useState('') // 바뀌는 달 변수를 추가!

    // 기본적으로 선택 되어있는 달
    const month = () => {
        const today = new moment(date, 'YYYY-MM-DD');
        const registDate = new Date(today);
        let month = registDate.getMonth() + 1;
        let monthEn = new Date(today).toLocaleDateString('en', { month: "short" })
        console.log(registDate)
        return <>{month} {monthEn}</>
    }

    // 지난 달
    const handlerClickPrev = () => {
        date.setMonth((date.getMonth()-1));
        
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        // const changedmonth = date.getMonth() + 1;
        const newDate = year + "" + month;
        setchangedMonth(date.getMonth() + 1); // 지난 달 버튼 누르면 바뀌는 달만 바뀌게
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/date/${newDate}`)
            .then(res => {
                console.log(res.data);
                setDatas(res.data.list);
            })
            .catch(err => {
                console.log(err);
            })
    };

    // 다음 달
    const handlerClickNext = () => {
        date.setMonth((date.getMonth()+1));
        
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        // const changedmonth = date.getMonth() + 1;
        const newDate = year + "" + month;
        setchangedMonth(date.getMonth() + 1); // 지난 달 버튼 누르면 바뀌는 달만 바뀌게 
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/date/${newDate}`)
            .then(res => {
                console.log(res.data);
                setDatas(res.data.list);
            })
            .catch(err => {
                console.log(err);
            })
    };


    // 삭제
    const handlerClickDelete = (e) => {
        axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/delete/${e}`)
            .then(response => {
                console.log(response);
                if (response.data === 1) {
                    const newDatas = datas.filter(d => d.habitIdx !== e);
                    setDatas(newDatas);
                } else {
                    alert('삭제에 실패했습니다.');
                    return;
                }
            })
            .catch(error => {
                console.log(error);
                return;
            });
    };

    // 입력
    const [content, setContent] = useState('');
    const handlerAddContent = e => setContent(e.target.value);
    const handlerAddSubmit = e => {
        e.preventDefault();

        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/add`, { habitContent: content })
            .then(response => {
                console.log(response);
                if (response.data === 1) {
                    window.location.reload();
                } else {
                    alert(response.data);
                    return;
                }
            })
            .catch(error => {
                console.log(error);
                alert(`${error.response.data.message} (${error.message})`);
                return;
            });
    };


    return (
        <div className="habit_tracker_container">
            {/* 타이틀 */}
            <div className="habit_tracker_title_circle">
                <img className="habit_tracker_title_circle_icon" src={chart}></img>
            </div>
            <h2 className="habit_tracker_title">MAKE A HABIT IN 30 DAYS!!</h2>

            {/* 월 */}
            <img className="habit_tracker_before_month" src={before_month} onClick={handlerClickPrev} />
            <div className="habit_tracker_month">{month()}</div>
            <img className="habit_tracker_next_month" src={next_month} onClick={handlerClickNext} />

            {/* 차트 */}
            <div className="my_habit_chart">
                <div className="my_habit_chart_title">My Habit Chart</div>
                <Habitchart today={date}/>
            </div>

            
            {/* 리스트 전체 */}
            <div className="habit_list_container">
                <div className="habit_list_title">My Habit</div>
                <div>
                    {datas && datas.map(habit =>
                        <div>
                            {/* 리스트 텍스트, 삭제 */}
                            <div className="list_box"> 
                                {parseInt(defaultmonth) === parseInt(changedmonth) ? ( // 현재 달이랑 바뀌는 달 변수를 비교하는데, str이라서 === 비교하면 타입까지 비교해서 int로 바꿔줌, 여기서 이제 현재달이랑 바뀌는 달이랑 비교
                                <MdRemoveCircleOutline className="habit_list_remove" // 이 ? 뒤가 조건문이 True 일때 돌아가는 곳 
                                    onClick={() => handlerClickDelete(habit.habitIdx)} /> 
                                    ) : (<div><MdRemoveCircleOutline className="habit_list_remove"></MdRemoveCircleOutline></div>)} 
                                <Link className="habit_list_text" to={`/habitDetail/${habit.habitIdx}`}>
                                    {habit.habitContent}
                                </Link>
                            </div>
                            <div className="habit_list_progress_box"></div>
                        </div>
                    )} 
                </div>
                {/* 입력칸 */}
                {parseInt(defaultmonth) === parseInt(changedmonth) ? (
                <div className="habit_list_insert">
                    <form onSubmit={handlerAddSubmit}>
                        <input type="text" className="habit_list_insert_text" placeholder="할일을 입력하세요."
                            value={content} onChange={handlerAddContent} />
                        <button type="submit" className="habit_list_insert_btn"><MdAdd /></button>
                    </form>
                </div> ) : ( <div></div>) }
            </div>

        </div>



    );
}

export default HabitTracker;