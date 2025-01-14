import Image from "next/image"
import InovaImage from "../../assets/inova.png"

const InovaBottomImage = () => {
    return (
        <Image
            src={InovaImage.src}
            alt="InovaImage"
            width={150}
            height={50}
            className="absolute bottom-[30px] right-[20px]"
        />
    )
}

export default InovaBottomImage