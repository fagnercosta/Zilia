import { Chart } from "react-google-charts";

const StencilGraphicLimit = () => {

    const totalDays = 1000;
    const daysUsed = 325;
    const daysRemaining = totalDays - daysUsed;

    const data = [
        ["Task", "Days"],
        ["Tempo restante", daysRemaining],
        ["Tempo utilizado", daysUsed],
    ];
    const options = {
        is3D: true,
    };

    return (
        <Chart
            chartType="PieChart"
            data={data}
            options={options}
            legendToggle
        />
    );
}

export default StencilGraphicLimit