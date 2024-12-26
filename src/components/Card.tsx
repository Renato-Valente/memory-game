import './card.css'
import { CSSProperties, useState, useRef } from "react";

const Card = (props:{size:number, background:string, image:string}) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
  
    const cardRef = useRef<HTMLDivElement>(null);
    const angleRef = useRef(0);
    const angleLimitRef = useRef(0);
  
    const {size, background, image} = props;
    const style:CSSProperties = {
      height: size,
      width: size * 3 / 4,
      scale: isHovered ? '1.2' : '1',
      border: isHovered ? '2px solid #E64833' : undefined
    }
  
    const handleMouseEnter = () => {
      if(isSelected) return;
      setIsHovered(true);
    }
    const handleMouseLeave = () => {
      if(isSelected || isAnimating) return;
      setIsHovered(false);
    }
  
    const animate = () => {
      if(!cardRef || !cardRef.current) return;
      if(angleLimitRef.current - angleRef.current == 90) setIsSelected((prev) => !prev);
      if(angleRef.current >= angleLimitRef.current) {
        setIsAnimating(false);
        return;
      }
  
      angleRef.current += 5;
      cardRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
      requestAnimationFrame(animate);
    }
  
    const handleClick = () => {
      //setIsSelected((prev) => !prev);
      angleLimitRef.current = angleRef.current + 180;
      setIsAnimating(true);
      requestAnimationFrame(animate);
    }
    return(
      <div onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave} 
           onClick={handleClick}
           ref={cardRef}
           style={style} className='card'>
          <img style={{display: isSelected ? 'block' : 'none'}} className='card-front' src={image} />
          <img style={{display: isSelected ? 'none' : 'block'}} src={background} className='card-background'/>
      </div>
    )
  }

export default Card;