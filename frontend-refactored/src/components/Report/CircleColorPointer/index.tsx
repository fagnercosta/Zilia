import { getRGB } from "@/functions/functions"
import { View } from "@react-pdf/renderer"

interface Props{
    valuePoint: any
}

const CircleColorPointer = ({valuePoint}: Props) => {

    return(
        <View
            style={{
                borderRadius: 500,
                width: 15,
                height: 15,
                backgroundColor: getRGB(valuePoint)
            }}
        >

        </View>
    )

}

export default CircleColorPointer