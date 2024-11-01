const ctx = document.getElementById('liveChart').getContext('2d');
let chart;
let sessions = [];
let exposureData = [];
let viewersData = [];
let salesData = [];
let ordersData = [];
let promoteData = [];
let currentLine = null;

function renderChart() {
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sessions,
            datasets: [
                {
                    label: '曝光',
                    data: exposureData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false,
                    cubicInterpolationMode: 'monotone' // 曲线平滑
                },
                {
                    label: '观看人数',
                    data: viewersData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false,
                    cubicInterpolationMode: 'monotone' // 曲线平滑
                },
                {
                    label: '成交金额',
                    data: salesData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                    cubicInterpolationMode: 'monotone' // 曲线平滑
                },
                {
                    label: '订单量',
                    data: ordersData,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    fill: false,
                    cubicInterpolationMode: 'monotone' // 曲线平滑
                },
                {
                    label: '推广费',
                    data: promoteData,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2,
                    fill: false,
                    cubicInterpolationMode: 'monotone' // 曲线平滑
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                },
            },
        }
    });

    // 显示工具提示并添加标记线
    ctx.canvas.addEventListener('mousemove', function (event) {
        const xPosition = event.offsetX;

        // 获取最近的场次数据
        const index = Math.round((xPosition / ctx.canvas.width) * (sessions.length - 1));
        const tooltip = document.getElementById('tooltip');
        
        if (index >= 0 && index < sessions.length) {
            // 显示工具提示
            tooltip.style.display = 'block';
            tooltip.style.left = `${event.clientX + 10}px`;
            tooltip.style.top = `${event.clientY + 10}px`;
            tooltip.innerHTML = `
                <strong>场次:</strong> ${sessions[index]}<br>
                <strong>曝光:</strong> ${exposureData[index]}<br>
                <strong>观看人数:</strong> ${viewersData[index]}<br>
                <strong>成交金额:</strong> ${salesData[index]}<br>
                <strong>订单量:</strong> ${ordersData[index]}<br>
                <strong>推广费:</strong> ${promoteData[index]}<br>
            `;

            // 绘制标记线
            if (currentLine) {
                currentLine.remove();
            }

            const yScale = chart.scales.y;
            const line = new Path2D();
            const yPosition = yScale.getPixelForValue(exposureData[index]); // 以曝光数据绘制线
            line.moveTo(xPosition, 0);
            line.lineTo(xPosition, chart.height);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke(line);

            currentLine = line;
        }
    });

    // 添加鼠标离开画布事件以隐藏 tooltip
    ctx.canvas.addEventListener('mouseout', function () {
        document.getElementById('tooltip').style.display = 'none';
        if (currentLine) {
            currentLine.remove();
            currentLine = null;
        }
    });
}

document.getElementById('addDataBtn').addEventListener('click', function () {
    document.getElementById('password').value = ''; // 清空密码输入框
    document.getElementById('passwordModal').style.display = "block";
});

document.querySelector('.closeBtn').addEventListener('click', function () {
    document.getElementById('dataModal').style.display = "none";
    document.getElementById('passwordModal').style.display = "none";
    document.getElementById('tooltip').style.display = 'none';
});

document.getElementById('submitPasswordBtn').addEventListener('click', function () {
    const password = document.getElementById('password').value;
    if (password === "sgmd") {
        document.getElementById('passwordModal').style.display = "none";
        showDataModal();
    } else {
        alert("密码错误，请重试！");
    }
});

function showDataModal() {
    const nextSessionId = sessions.length ? Math.max(...sessions) + 1 : 1;
    document.getElementById('session').value = nextSessionId;
    document.getElementById('modalTitle').innerText = '添加新直播数据';
    document.getElementById('exposure').value = '';
    document.getElementById('viewers').value = '';
    document.getElementById('sales').value = '';
    document.getElementById('orders').value = '';
    document.getElementById('promote').value = '';
    
    document.getElementById('dataModal').style.display = "block";
}

document.getElementById('saveDataBtn').addEventListener('click', function () {
    const session = parseInt(document.getElementById('session').value);
    const exposure = parseInt(document.getElementById('exposure').value);
    const viewers = parseInt(document.getElementById('viewers').value);
    const sales = parseInt(document.getElementById('sales').value);
    const orders = parseInt(document.getElementById('orders').value);
    const promote = parseInt(document.getElementById('promote').value);
    
    const index = sessions.indexOf(session);
    
    if (index === -1) {
        // 新增数据
        sessions.push(session);
        exposureData.push(exposure);
        viewersData.push(viewers);
        salesData.push(sales);
        ordersData.push(orders);
        promoteData.push(promote);
    } else {
        // 更新数据
        exposureData[index] = exposure;
        viewersData[index] = viewers;
        salesData[index] = sales;
        ordersData[index] = orders;
        promoteData[index] = promote;
    }
    
    renderChart();
    
    document.getElementById('dataModal').style.display = "none";
});

// 关闭模态框
window.onclick = function(event) {
    if (event.target === document.getElementById('dataModal') || event.target === document.getElementById('passwordModal')) {
        document.getElementById('dataModal').style.display = "none";
        document.getElementById('passwordModal').style.display = "none";
    }
}

// 初始调用渲染图表
renderChart();
