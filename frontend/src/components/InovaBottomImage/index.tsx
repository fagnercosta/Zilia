import Image from "next/image"
import InovaImage from "../../assets/inova.png"

const InovaBottomImage = () => {
    return (
        <Image
            src={InovaImage.src}
            alt="InovaImage"
            width={200}
            height={60}
            
        />
    )
}

export default InovaBottomImage