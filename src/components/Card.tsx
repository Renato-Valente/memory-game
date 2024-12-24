import { CSSProperties, useState } from "react";

const Card = (props:{size:number}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    
    //const []
    const size = props.size;
    //if(!size) return;
    //setando a cor da carta
    const getColor = () => {
        if(isSelected) return 'green';
        return isHovered ? 'orange' : 'red';
    }
    const style:CSSProperties = {
        height: 4 / 3 * size,
        width: 1 * size,
        backgroundColor: getColor()
    }

    return(
        <div
            onClick={() => {setIsSelected((prev) => !prev)}}
            onMouseEnter={() => {
                if (isSelected) return;
                setIsHovered(true);
            }}
             onMouseLeave={() => {
                if(isSelected) return;
                setIsHovered(false);
             }}
             style={style} className="card">

        </div>
    )


}

export default Card;