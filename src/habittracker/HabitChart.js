import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

function HabitChart(props) {

    const [average, setAverage] = useState('');
    useEffect(() => {
        const date = new Date(props.today);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const newDate = year + "" + month + "01";
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/chart/${newDate}`)
            .then(response => {
                setAverage(response.data.average);
            })
            .catch(error => {
                console.log(error);
            });
    }, [props]);

    var average_list = [];
    for (const averages of average) {
        average_list.push(averages.completionRate);
    }

    const options = {

        chart: {
            backgroundColor: "#E44A4A",
            type: 'line',
            height: "48%"
        },

        credits: {
            enabled: false,
        },

        title: {
            text: '',
            align: 'center',
            style: {
                'fontFamily': 'Dovemayo_gothic',
                'fontWeight': 'bold',
                'color': '#FFF8DD'
            }
        },

        subtitle: {
            text: 'GOAL ',
            align: 'left',
            style: {
                'color': '#FFF8DD',
                'fontFamily': 'NanumSquareNeo-Variable',
                'fontWeight': 'bold',
                'fontSize': '14px'
            }
        },

        xAxis: {
            lineColor: '#FFF8DD',
            tickColor: '#FFF8DD',
            type: 'day',
            title: {
                text: "DAY",
                style: {
                    'color': '#FFF8DD',
                    'fontFamily': 'NanumSquareNeo-Variable',
                    'fontWeight': 'bold',
                    'fontSize': '14px',
                    'letterSpacing': '3px'
                }
            },
            labels: {
                style: {
                    "fontFamily": "Dovemayo_gothic",
                    "fontSize": "14px",
                    'color': '#FFF8DD'
                }
            },
            alignTicks: false,
            tickInterval: 1
        },

        yAxis: {
            gridLineColor: "#FFF8DD",
            title: {
                text: null
            },
            tickPositions: [0, 25, 50, 75, 100],
            labels: {
                style: {
                    'color': '#FFF8DD',

                    'fontFamily': 'Dovemayo_gothic',
                    'fontSize': '14px'
                }
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '%'
        },

        plotOptions: {
            series: {
                pointStart: 1,
                pointEnd: 30
            },

        },

        series: [{
            name: '달성률',
            data: average_list,
            zIndex: 1,
            color: '#FFF8DD',
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                lineColor: '#FFF8DD'
            }
        }],
        legend: {
            floating: true,
            align: 'right',
            verticalAlign: 'top',
            itemStyle: {
                'color': '#FFF8DD',
                'fontFamily': 'NanumSquareNeo-Variable',
                'fontSize': '14px'
            }
        }
    };

    return (
        <>
            <div className="container">
                <div className="chart-wrap">
                    <div id='test-chart' style={{ height: '500px', width: '1045px', paddingTop: '20px' }}>
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    </div>
                </div>
            </div>
        </>

    )
};
export default HabitChart;