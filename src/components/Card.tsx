import './card.css'
import { CSSProperties, useState, useRef, useEffect } from "react";

type propsType = {
  size:number,
  id:number,
  image:string,
  background:string,
  hovererd:boolean,
  selected: boolean,
  collected:boolean,
  setCards: (value: React.SetStateAction<{hovered:boolean, selected:boolean, collected:boolean, image:string}[]>) => void 
}

const Card = (props:propsType) => {

  const {size, image, background, hovererd, selected, collected, id,  setCards} = props;

  const [scale, setScale] = useState(1);
  const [angle, setAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isSelectedRef = useRef(false);
  const scaleRef = useRef(scale);
  const tmpScaleRef = useRef(scale);

  const angleRef = useRef(angle);
  const tmpAngleRef = useRef(angle);

  const lastTime = useRef(0);
  const isCollectedRef = useRef(false);
  
  const isAnimating = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const frontRef = useRef<HTMLImageElement>(null);


  useEffect(() => {
    //console.log('ain, madruguinha')
    const newAngle = selected ? 180 : 360;
    setAngle((prev) => {
      if(prev == newAngle) return prev;
      tmpAngleRef.current = newAngle;
      angleRef.current = newAngle;
      return newAngle;
    });

    const selected_ = selected;
    isSelectedRef.current = selected_;

    setCards((prev) => {
      if(prev[id].selected == selected_) return prev;
      const result = prev.map((item) => {return {...item}});
      result[id].selected = selected_
      return result;
    })
  })

//animation to make the card inscrease or decrease its scale

const scaleAnimation = (value:number, onComplete?:() => void) => {

  if(!cardRef || !cardRef.current) return;
  isAnimating.current = true;
  const time = Date.now();
  const delta = time - lastTime.current;

  //target is the value we want to achieve at the end od the animation
  const target = scaleRef.current + value;
  //direction defines if we're going to inscrease or decrease the scale's value
  const direction = value >= 0 ? 1 : -1;
  const inscrement = delta > 100 ? 0 : 2 * direction * delta / 1000;
  tmpScaleRef.current = tmpScaleRef.current += inscrement;

  //setting all scale values to target at the end of the animation
  if((tmpScaleRef.current >= target && direction > 0) ||
     (tmpScaleRef.current <= target && direction < 0)) {
      tmpScaleRef.current  = target;
      scaleRef.current = target;
      setScale(target);
      isAnimating.current = false;
      if(onComplete) onComplete();

      return;
     }

  //console.log('tmpscale: ', tmpScaleRef.current);
  cardRef.current.style.scale = `${tmpScaleRef.current}`;

  lastTime.current = time;
  requestAnimationFrame(() => scaleAnimation(value, onComplete));
}

// animation to make the card spin around itself on the Y axis
  const rotateAnimation = (deg:number, onComplete?:() => void) => {

    if(!cardRef.current || !backRef.current || !frontRef.current) return;
    isAnimating.current = true;
    const time = Date.now();
    const delta = time - lastTime.current;

    const target = angleRef.current + deg;
    const direction = deg > 0 ? 1 : -1;

    const increment = delta > 100 ? 0 : 300 * direction * delta / 1000
    tmpAngleRef.current = tmpAngleRef.current + increment;

    //Target angle reached. Finishing the spin animation
    if((tmpAngleRef.current >= target && deg >= 0) || (tmpAngleRef.current <= target && deg <= 0)) {
      tmpAngleRef.current =  convertAngle(target);
      angleRef.current = convertAngle(target);
      setAngle(convertAngle(target));
      isAnimating.current = false;

      const selected_ = !isFlipped(tmpAngleRef.current);
      //console.log('selected ca estamos', selected_);
      isSelectedRef.current = selected_;

      //Atualizando o valor do estado cards do component App
      setCards((prev) => {
        let result = [...prev];
        result[id].selected = selected_;
        return result;
      })

      if(onComplete) onComplete();
      return;
    }

    cardRef.current.style.transform = `rotateY(${tmpAngleRef.current}deg)`;
    backRef.current.style.display = isFlipped(tmpAngleRef.current) ? 'block' : 'none';
    frontRef.current.style.display = !isFlipped(tmpAngleRef.current) ? 'block' : 'none';
    
    lastTime.current = time;
    requestAnimationFrame(() => rotateAnimation(deg, onComplete));
  }

  const handlePointerEnter = () => {
    console.log('angle', tmpAngleRef.current);
    if(isAnimating.current || isSelectedRef.current || isCollectedRef.current) return;
    if(!cardRef.current) return;
    if(collected) return;

    setCards((prev) => {
      let result = [...prev];
      result.forEach((item) => {
        if(item.selected) return;
        item.hovered = false;
      })
      result[id].hovered = true;
      return result;

      // return prev;
    })
    /* setIsHovered(true);
    setScale(1.2);
    cardRef.current.style.border = '1px solid red'; */
  }

  const handlePointerLeave = () => {
    if(isAnimating.current || isSelectedRef.current || isCollectedRef.current) return;
    if(!cardRef.current) return;
    if(collected) return;

    setCards((prev) => {
      let result = [...prev];
      result[id].hovered = false;
      return result;
    })
    
    /* setIsHovered(false);
    setScale(1);
    cardRef.current.style.border = ''; */
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if(isAnimating.current || collected) return;
    rotateAnimation(180);
    console.log('event: ', e);
  }

  const convertAngle = (value:number) => {
    if(value > 360) return convertAngle(value - 360);
    if(value < 0) return convertAngle(value + 360);
    return value;
  }

  //retorna true se a carda esta virada pra baixo
  const isFlipped = (value:number) => {
    const newValue = convertAngle(value);
    return (newValue < 90 || newValue > 270)
  }
  let cardScale = hovererd || selected ? '1.2' : '1';
  cardScale = collected ? '-1 1' : cardScale;
  return(
    <div
    onPointerEnter={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
    onClick={(e) => handleClick(e)}
    ref={cardRef}
    style={{
      width: size * 3 /4,
      //scale: `${scale}`,
      scale: (hovererd || selected) && !collected ? '1.2' : '1',
      border: (hovererd || selected) && !collected ? '1px solid red' : '',
      transform: collected ? 'rotateY(180deg)' : `rotateY(${angle}deg)`,
      height: size,
      position: 'relative'
    }}
    className="card">
    <div className="collect-layer" style={{opacity: collected ? 0.5 : 0}}></div>
    <img ref={backRef} style={{display: isFlipped(tmpAngleRef.current) && !collected ? 'block' : 'none'}} src={background} className="card-background" />
    <img ref={frontRef} style={{display: isFlipped(tmpAngleRef.current) && !collected ? 'none' : 'block'}} src={image}className="card-front" />
    </div>
  )

}

export default Card;