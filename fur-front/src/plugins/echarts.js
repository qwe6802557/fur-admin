export const myEchartsOne = {
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {
    },
    legend: {
        data: [ // 图列内容
            {
                name: '点赞数',
                icon: 'circle',
                textStyle: {
                    /* color: 'red', */ // 单独设置某一个图列的颜色
                    backgroundColor: '#fff' // 单独设置某一个图列的字体背景色
                }
            }
        ]
    },
    // 工具箱
    toolbox: {
        show: true,
        feature: {
            saveAsImage: {
                show: true
            },
            restore: {
                show: true
            },
            dataView: {
                show: true
            },
            dataZoom: {
                show: false
            },
            magicType: {
                type: ['line', 'bar']
            }
        }
    },
    series: [{
        name: '点赞数',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20],
        markPoint: {
            data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
            ]
        },
        markLine: {
            data: [
                { type: 'average', name: '平均值' }
            ]
        }
    }],
    color: '#0092F1'
};
export const myEchartsTwo = {
    tooltip: {
        trigger: 'axis'
    },
    aria: {
        show: true
    },
    xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {
    },
    legend: {
        data: [ // 图列内容
            {
                name: '粉丝数',
                icon: 'circle',
                textStyle: {
                    /* color: 'red', */ // 单独设置某一个图列的颜色
                    backgroundColor: '#fff' // 单独设置某一个图列的字体背景色
                }
            }
        ]
    },
    // 工具箱
    toolbox: {
        show: true,
        feature: {
            saveAsImage: {
                show: true
            },
            restore: {
                show: true
            },
            dataView: {
                show: true
            },
            dataZoom: {
                show: false
            },
            magicType: {
                type: [ 'line', 'bar' /* 'stack', 'tiled' */]
            }
        }
    },
    series: [{
        name: '粉丝数',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20],
        markPoint: {
            data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
            ]
        },
        markLine: {
            data: [
                { type: 'average', name: '平均值' }
            ]
        }
    }],
};

export const provinceMap = data => ({
    tooltip: { // 鼠标移到图里面的浮动提示框
        // formatter详细配置： https://echarts.baidu.com/option.html#tooltip.formatter
        /* formatter (params/!*, ticket, callback*!/) {
             // params.data 就是series配置项中的data数据遍历
             let localValue,
                 perf,
                 downloadSpeep,
                 usability,
                 point;
             if (params.data) {
                 localValue = params.data.value;
                 perf = params.data.perf;
                 downloadSpeep = params.data.downloadSpeep;
                 usability = params.data.usability;
                 point = params.data.point;
             } else { // 为了防止没有定义数据的时候报错写的
                 localValue = 0;
                 perf = 0;
                 downloadSpeep = 0;
                 usability = 0;
                 point = 0
             }
             let htmlStr = `
           <div style='font-size:18px;'> ${params.name}</div>
           <p style='text-align:left;margin-top:-10px;'>
               区域对应数据value：${localValue}<br/>
               性能perf：${perf}<br/>
               下载速度downloadSpeep：${downloadSpeep}<br/>
               可用性usability：${usability}<br/>
               监测点数point：${point}<br/>
           </p>
         `
             return htmlStr
         }*/
        // backgroundColor:"#ff7f50",//提示标签背景颜色
        // textStyle:{color:"#fff"} //提示标签字体颜色
    },
    // visualMap的详细配置解析：https://echarts.baidu.com/option.html#visualMap
    visualMap: { // 左下角的颜色区域
        type: 'piecewise', // 定义为分段型 visualMap
        min: 0,
        max: 1000,
        itemWidth: 40,
        bottom: 60,
        left: 20,
        pieces: [ // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
            {gt: 30, lte: 40, label: '分布密集', color: '#6ad86e'}, // (900, 1000]
            {gt: 20, lte: 30, label: '分布较多', color: '#9adcfa'}, // (500, 900]
            {gt: 10, lte: 20, label: '分布一般', color: '#ffeb3b'}, // (310, 500]
            {gt: 5, lte: 10, label: '分布少量', color: '#ff9800'}, // (200, 300]
            {gt: 0, lte: 5, label: '分布极少量', color: 'orangered'}, // (10, 200]
            {value: 0, label: '无数据', color: '#999'} // [0]
        ]
    },
    // geo配置详解： https://echarts.baidu.com/option.html#geo
    geo: { // 地理坐标系组件用于地图的绘制
        map: 'china', // 表示中国地图
        // roam: true, // 是否开启鼠标缩放和平移漫游
        zoom: 1.2, // 当前视角的缩放比例（地图的放大比例）
        label: {
            show: true
        },
        itemStyle: { // 地图区域的多边形 图形样式。
            borderColor: 'rgba(0, 0, 0, 0.2)',
            emphasis: { // 高亮状态下的多边形和标签样式
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    },
    series: [
        {
            name: '', // 浮动框的标题（上面的formatter自定义了提示框数据，所以这里可不写）
            type: 'map',
            geoIndex: 0,
            label: {
                show: true
            },
            // 这是需要配置地图上的某个地区的数据，根据后台的返回的数据进行拼接（下面是我定义的假数据）
            data: data/*[{
                'name': '北京',
                'value': 599,
                'perf': '0.501s', // 性能
                'downloadSpeep': '1.221MB/s', // 下载速度
                'usability': '100%', // 可用性
                'point': '250' // 监测点
            }, {
                'name': '上海',
                'value': 142
            }, {
                'name': '黑龙江',
                'value': 44
            }, {
                'name': '新疆',
                'value': 999,
                'perf': '0.501s', // 性能
                'downloadSpeep': '1.221MB/s', // 下载速度
                'usability': '100%', // 可用性
                'point': '250' // 监测点
            }, {
                'name': '深圳',
                'value': 92
            }, {
                'name': '湖北',
                'value': 810
            }, {
                'name': '四川',
                'value': 453
            }]*/
        }
    ]
});
/**
 * 柱状图
 */
export const longPie = data => {
    const xData = data.map( item => item.name);
    return {
        /*title:{
            text:'饼图'
        },*/
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        color: [
            '#2295f1',
            '#ffc107',
            '#a2d581',
            '#f44336',
            '#5fd0d1',
            '#9b59b6',
            '#27ae60',
            '#f39c12',
            '#1abc9c',
            '#8e44ad',
            '#d64541',
            '#3A539B'
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        series: [
            {
                name: '计划数量',
                type: 'bar',
                data: data,
                barGap: 0,
                barWidth: 30,
                itemStyle: {
                    normal: {
                        barBorderRadius: [16, 16, 0, 0]
                    }
                }
            }
        ]
    }
};
/**
 * 饼图
 */
export const chatPie = (myChart, text, data, count) => ({
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: '65%',
        top: 30,
        /*data: legendData,*/
        itemGap: 20,
        tooltip: {
            show: true
        }
    },
    title: [
        {
            text,
            textStyle: {
                color: '#3d3d3d',
                fontSize: 14,
                fontWeight: 'normal',
                fontFamily: '华文细黑'
            },
            x: '35%',
            y: myChart.getHeight() * 0.45 - 12
        },
        {
            text: '数量：' + count,
            textStyle: {
                color: '#3d3d3d',
                fontSize: 14,
                fontWeight: 'normal',
                fontFamily: '华文细黑'
            },
            x: '36%',
            y: myChart.getHeight() * 0.45 + 12
        }
    ],
    color: [
        '#2295f1',
        '#ffc107',
        '#a2d581',
        '#f44336',
        '#5fd0d1',
        '#9b59b6',
        '#27ae60',
        '#f39c12',
        '#1abc9c',
        '#8e44ad',
        '#d64541',
        '#3A539B'
    ],
    series: [
        {
            name: '订单分析图',
            type: 'pie',
            center: ['40%', '50%'],
            radius: ['60%', '90%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: data
        }
    ]
});
