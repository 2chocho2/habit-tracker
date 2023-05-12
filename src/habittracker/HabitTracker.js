import { MdRemoveCircleOutline, MdAdd } from 'react-icons/md';
import { TiArrowForwardOutline } from "react-icons/ti";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import chart from "../img/chart.png"
import before_month from "../img/before_month.png"
import next_month from "../img/next_month.png"
import swal from 'sweetalert2';
import HabitChart from './HabitChart';
import "./HabitTracker.css";

const HabitTracker = () => {

    useEffect(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const newDate = year + "" + month;
        setdefaultMonth(date.getMonth() + 1); // 현재달 변수를 설정
        setchangedMonth(date.getMonth() + 1);
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/date/${newDate}`)
            .then(response => {
                setDatas(response.data.list);
                setDate(new Date(new moment(response.data.month, 'YYYY-MM')));
            })
            .catch(error => {
                console.log(error);
            });
    }, []);


    const [datas, setDatas] = useState([]);
    const [date, setDate] = useState('');
    const [defaultmonth, setdefaultMonth] = useState('') // 달 바꿈을 추적하기 위해서 현재달 변수랑
    const [changedmonth, setchangedMonth] = useState('') // 바뀌는 달 변수를 추가

    // 기본적으로 선택 되어있는 달
    const month = () => {
        const today = new moment(date, 'YYYY-MM-DD');
        const registDate = new Date(today);
        let month = registDate.getMonth() + 1;
        let monthEn = new Date(today).toLocaleDateString('en', { month: "short" })
        return <>{month} {monthEn}</>
    }

    // 지난 달
    const handlerClickPrev = () => {
        date.setMonth((date.getMonth() - 1));

        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const newDate = year + "" + month;
        setchangedMonth(date.getMonth() + 1); // 지난 달 버튼 누르면 바뀌는 달만 바뀌게
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/date/${newDate}`)
            .then(res => {
                setDatas(res.data.list);
            })
            .catch(err => {
                console.log(err);
            })
    };

    // 다음 달
    const handlerClickNext = () => {
        date.setMonth((date.getMonth() + 1));

        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const newDate = year + "" + month;
        setchangedMonth(date.getMonth() + 1); // 지난 달 버튼 누르면 바뀌는 달만 바뀌게 
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/date/${newDate}`)
            .then(res => {
                setDatas(res.data.list);
            })
            .catch(err => {
                console.log(err);
            })
    };

    // 입력
    const [content, setContent] = useState('');
    const handlerAddContent = e => setContent(e.target.value);

    const handlerAddSubmit = e => {
        e.preventDefault();

        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/add`, { habitContent: content })
            .then(response => {
                if (response.data === 1) {
                    window.location.reload();
                } else {
                    alert(response.data);
                    return;
                }
            })
            .catch(error => {
                console.log(error);
                return;
            });
    };

    // 삭제
    const handlerClickDelete = (e) => {
        swal.fire({
            title: '삭제 하시겠습니까?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#E44A4A',
            denyButtonColor: '#FFCACA',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/delete/${e}`)
                swal.fire({
                    title: '삭제되었습니다.',
                    icon: 'success',
                    confirmButtonColor: '#E44A4A',
                    iconColor: '#E44A4A'
                })
                const newDatas = datas.filter(d => d.habitIdx !== e);
                setDatas(newDatas);
            } else if (result.isDenied) {
            }
        })
            .catch(error => {
                console.log(error);
                return;
            });
    }

    return (
        <div className="habit_tracker_container">

            {/* 타이틀 */}
            <div className="habit_tracker_title_circle">
                <img className="habit_tracker_title_circle_icon" src={chart}></img>
            </div>
            <h2 className="habit_tracker_title">MAKE A HABIT IN 30 DAYS!!</h2>

            {/* 월 */}
            <img className="habit_tracker_before_month"
                src={before_month}
                onClick={handlerClickPrev} />
            <div className="habit_tracker_month">{month()}</div>
            <img className="habit_tracker_next_month"
                src={next_month}
                onClick={handlerClickNext} />

            {/* 차트 */}
            <div className="my_habit_chart">
                <div className="my_habit_chart_title">My Habit Chart</div>
                <HabitChart today={date} />
            </div>

            {/* 리스트 */}
            <div className="habit_list_container">
                <div className="habit_list_title">My Habit</div>
                {datas && datas.map(habit =>
                    <div className="list_box">

                        {
                            parseInt(defaultmonth) === parseInt(changedmonth)
                                ?
                                (<MdRemoveCircleOutline className="habit_list_remove"
                                                        onClick={() => handlerClickDelete(habit.habitIdx)} />)
                                :
                                (<div><MdRemoveCircleOutline className="habit_list_remove" /></div>)
                        }

                        <Link className="habit_list_text"
                            to={`/habitDetail/${habit.habitIdx}`}>
                            {habit.habitContent}
                            <TiArrowForwardOutline className='icon' />
                        </Link>
                    </div>
                )}

                {/* 입력칸 */}
                {parseInt(defaultmonth) === parseInt(changedmonth)
                    ?
                    (
                        <div className="habit_list_insert">
                            <form onSubmit={handlerAddSubmit}>
                                <div className="insert_text">
                                    <input type="text"
                                            placeholder="할일을 입력하세요"
                                            value={content}
                                            onChange={handlerAddContent} />
                                </div>

                                <div className="insert_btn">
                                    <button type="submit"><MdAdd /></button>
                                </div>
                            </form>
                        </div>
                    )
                    :
                    (<div></div>)}
            </div>
        </div>
    );
}


export default HabitTracker;