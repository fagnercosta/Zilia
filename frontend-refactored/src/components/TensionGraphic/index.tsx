import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
    data: any
}

export const TensionGraphics = ({ data }: Props) => {
    return (
        <ResponsiveContainer>
            <LineChart data={data}>
                <CartesianGrid stroke="#8d8d8d" strokeDasharray={5} />
                <XAxis dataKey="cycles" type="number" domain={[0, 1000]} />
                <YAxis domain={[0, 50]} />
                <Tooltip />
                <Line
                    type="natural"
                    strokeWidth="3"
                    dataKey={"tension"}
                    stroke={"#8884d8"}
                    animationDuration={800}
                    animationEasing="ease-in-out"
                    animationBegin={200}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}