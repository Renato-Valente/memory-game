import './card.css'
import { CSSProperties, useState, useRef } from "react";

const Card = (props:{size:number, background:string, image:string}) => {

  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const angleLimitRef = useRef(0);
  const lasTimeRef = useRef(0);
  const isFlippedRef = useRef(false);

  const {size, background, image} = props;
  const style:CSSProperties = {
    height: size,
    width: size * 3 / 4,
    scale: isHovered ? '1.2' : '1',
    border: isHovered ? '1px solid yellow' : undefined
  }

  const handleMouseEnter = () => {
    if(isSelected) return;
    setIsHovered(true);
  }
  const handleMouseLeave = () => {
    if(isSelected || isAnimating) return;
    setIsHovered(false);
  }

  //this is the functionthat is going to make the card spin 180 degrees
  const animate = () => {
    const time = Date.now();
    const delta = time - lasTimeRef.current;
    if(!cardRef || !cardRef.current) return;
    //after spinning 90 degrees, the image of the card should change, 
    //giving the impression that it has flipped
    if((angleLimitRef.current - angleRef.current) <= 90 && !isFlippedRef.current) {
      isFlippedRef.current = true;
      setIsSelected((prev) => !prev);
    }
    if(angleRef.current >= angleLimitRef.current) {
      console.log('angle: ', angleLimitRef.current);
      setIsAnimating(false);
      return;
    }
    
    //console.log('delta: ', delta);
    const valueToAdd = delta < 100 ? Math.floor(300 * delta / 1000) : 0;
    console.log('adding: ', valueToAdd);
    
    //checking if the final result is bigger than angleLimiRef. If so, it means
    //the card spinned more than it should
    angleRef.current = angleRef.current + valueToAdd >= angleLimitRef.current ?
    angleLimitRef.current : angleRef.current + valueToAdd;

    cardRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
    lasTimeRef.current = time;
    requestAnimationFrame(animate);
  }

  const handleClick = () => {
    if(isAnimating) return;
    setIsAnimating(true);
    angleLimitRef.current = angleRef.current + 180;
    isFlippedRef.current = false;
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