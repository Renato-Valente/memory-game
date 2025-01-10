import { useEffect, useRef } from 'react'
import './card.css';

type propsType = {
    config: {
      hovered:boolean, selected:boolean, collected:boolean, image:string,
    reset:boolean
    },
    size: number, id:number, background: string
    setCards: (value:React.SetStateAction<{
      
      hovered:boolean, selected:boolean, collected:boolean, image:string,
      reset:boolean
      
    }[]>) => void
  
}
const Card = (props: propsType) => {

  
  //refs
  const lastTimeRef = useRef(Date.now());
  const angleRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const frontRef = useRef<HTMLImageElement>(null);

  
  const isFlipped = (angle:number) => {
    return angle > 90 && angle < 270;
  }
  
  const {size, config, background, setCards, id} = props;
  const {image, hovered, selected, collected, reset} = config;
  
  useEffect(() => {
    if(!cardRef.current || !backRef.current || !frontRef.current) return;
    const angle = selected || collected ? 180 : 0;
    cardRef.current.style.transform = `rotateY(${angle}deg)`;
    backRef.current.style.display = selected || collected ? 'none' : 'block';
    frontRef.current.style.display = selected || collected ? 'block' : 'none';

    if(reset) {

      resetAnimation(() => {
        console.log('reset: ', id);
        //set the reset value of all cards to false
        setCards((prev) => {
          const result = prev.map((item) => {return {...item}});
          /* for(const card of result) {
            if(!card.reset) continue;
            card.reset = false;
          } */
          result[id].reset = false;
          return result;
        })
      });
    }
  })

  //functions

  const resetAnimation = (onComplete?: () => void) => {
    if(!cardRef.current) return;
    if(!backRef.current || !frontRef.current) return;
    if(isAnimatingRef.current) return;

    //setting the initial values before the animation starts
    backRef.current.style.display = 'none';
    frontRef.current.style.display = 'block';
    let hasChanged = false;
    isAnimatingRef.current = true;
    angleRef.current = 180;

    const animation = () => {
      if(!cardRef.current) return;
      if(!backRef.current || !frontRef.current) return;
      const time = Date.now();
      const delta = time - lastTimeRef.current;
      const increment = delta > 100 ? 0 : -300 * delta / 1000;
      angleRef.current += increment;

      if(angleRef.current <= 90 && !hasChanged) {
        hasChanged = true;
        backRef.current.style.display = 'block';
        frontRef.current.style.display = 'none';
      }

      if(angleRef.current <= 0) {
        //setting the final values after the animation ends
        cardRef.current.style.transform = `rotateY(0deg)`  
        isAnimatingRef.current = false;
        if(onComplete) onComplete();

        return;
      }

      cardRef.current.style.transform = `rotateY(${angleRef.current}deg)`

      lastTimeRef.current = time;
      requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
  }

  const selectAnimation = () => {
    if(!cardRef || !cardRef.current) return;
    if(!backRef.current || !frontRef.current) return;
    isAnimatingRef.current = true;
    const limit = angleRef.current + 180;

    const animation = () => {
      if(!cardRef || !cardRef.current) return;
      if(!backRef.current || !frontRef.current) return;
      const time = Date.now();
      const delta = time - lastTimeRef.current;

      const increment = delta > 100 ? 0 : 300 * delta / 1000;
      angleRef.current += increment;
      
      if(angleRef.current >= limit - 90) {
        backRef.current.style.display = selected ? 'block' : 'none';
        frontRef.current.style.display = !selected ? 'block' : 'none';
      } 
      
      if(angleRef.current >= limit) {
        //changing the card's selected value
        setCards((prev) => {
          const result = prev.map((item) => {return {...item}});
          result[id].selected = !result[id].selected;
          return result;
      })
      
      cardRef.current.style.transform = `rotateY(${limit}deg)`
      isAnimatingRef.current = false;
      return;
    }
    //makes the card spin around the Y axis
    cardRef.current.style.transform = `rotateY(${angleRef.current}deg)`;

    lastTimeRef.current = time;
    requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation)
  }

  const normalizeAngle = (angle:number) => {
    if(angle >= 0 && angle < 360) return angle;
    if(angle < 0) return normalizeAngle(360 + angle);
    return normalizeAngle(angle % 360);
}

  const handlePointerEnter = () => {
    if(isAnimatingRef.current || selected || collected) return;
    //set the card hovered value to true and set all the other cards to false
    setCards((prev) => {
      const result = prev.map((item) => {return {...item}});
      for(const card of result) {
        if(card.selected) continue;
        card.hovered = false;
      }
      result[id].hovered = true;
      return result;
    })
  }

  const handlePointerLeave = () => {
    if(isAnimatingRef.current || selected || collected) return;
    //set the card's hovered value to false
    setCards((prev) => {
      const result = prev.map((item) => {return {...item}});
      result[id].hovered = false;
      return result;
    })
  }

  const handlePointerDown = () => {
    if(isAnimatingRef.current) return;
    if(collected) return;
    angleRef.current = selected ? 180 : 0;
    selectAnimation();
  }

  return(
    <div
    ref={cardRef}
    onPointerEnter={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
    onPointerDown={handlePointerDown}

    style={{
      scale: hovered && !collected ? '1.2' : '1',
      width: size * 3 / 4,
      height: size,
    }} className="card">
    
    <img ref={backRef} src={background} style={{display: (selected || collected) ? 'none' : 'block'}} className="card-background" />
    <img ref={frontRef} src={image} style={{display: !(selected || collected) ? 'none' : 'block'}} className="card-front" />
    <div style={{display: collected ? 'block' : 'none'}} className="collected-layer"></div>
    </div>
  )

}

export default Card;