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
                console.log(response.data);
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
            height: "55%"
        },

        credits: {
            enabled: false,
        },

        title: {
            text: '',
            align: 'center',
            style: {
                'fontFamily': 'Inter',
                'fontWeight': 'bold',
                'color': '#FFF8DD'
            }
        },

        subtitle: {
            text: 'GOAL ',
            align: 'left',
            style: {
                'color': '#FFF8DD',
                'fontWeight': 'bold'
            }
        },

        xAxis: {
            lineColor: '#FFF8DD',
            tickColor: '#FFF8DD',
            type: 'day',
            title: {
                text: "DAY",
                style: {
                    'fontFamily': 'Inter',
                    'fontWeight': 'bold',
                    'fontSize': '14px',
                    'color': '#FFF8DD'
                }
            },
            labels: {
                style: {
                    "fontFamily": "Inter",
                    'fontWeight': 'bold',
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
                    'fontWeight': 'bold'
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
                'fontFamily': 'Inter',
                'fontWeight': 'bold'
            }
        }
    };

    return (
        <>
            <div className="container">
                <div className="chart-wrap">
                    <div id='test-chart' style={{ height: '500px', width: '900px', paddingTop: '30px' }}>
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    </div>
                </div>
            </div>

        </>

    )
};
export default HabitChart;