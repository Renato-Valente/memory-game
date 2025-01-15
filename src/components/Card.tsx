import { useEffect, useRef } from 'react'
import './card.css';
import { cardObject } from '../App';

type propsType = {
    config: cardObject,
    size: {
      card:number, container:number, padding:number, containerHeight:number
    }, id:number, background: string
    setCards: (value:React.SetStateAction<cardObject[]>) => void
  
}
const Card = (props: propsType) => {

  
  //refs
  const lastTimeRef = useRef(Date.now());
  const angleRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isRebootingRef = useRef(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const frontRef = useRef<HTMLImageElement>(null);

  
  const isFlipped = (angle:number) => {
    return angle > 90 && angle < 270;
  }
  
  const {size, config, background, setCards, id} = props;
  const {image, hovered, selected, collected, reset, reboot} = config;
  
  useEffect(() => {
    if(!cardRef.current || !backRef.current || !frontRef.current) return;
    if(isRebootingRef.current) return;

    if(reboot){
      console.log('rebooting');
      const [x, y] = getPosition();
      backRef.current.style.display = 'block';
      frontRef.current.style.display = 'none';
      cardRef.current.style.transform = 'rotateY(0deg)';
      isAnimatingRef.current = false;

      const initialX = size.container / 2 - size.card * 3 / 4 / 2;
      const initialY = size.containerHeight / 2 - size.card / 2;
      moveAnimation(initialX, initialY, x, y, () => {
        setCards((prev) => {
          const result = prev.map((item) => {return {...item}});
          result[id].reboot = false;
          return result;
        })
      });
      return;
    }

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

  const moveAnimation = (initialX:number, initialY:number, finalX:number, finalY:number, onComplete?: () => void) => {
    if(!cardRef.current) return;
    
    isRebootingRef.current = true;
    let x = initialX;
    let y = initialY;
    const deltaX = finalX - initialX;
    const deltaY = finalY - initialY;
    const xIncrement = Math.abs(deltaX / deltaY) * (deltaX > 0 ? 1 : -1);
    const yIncrement = deltaY > 0 ? 1 : -1;
    cardRef.current.style.position = 'absolute';

    const animation = () => {
      if(!cardRef.current) return;
      const time = Date.now();
      const delta = time - lastTimeRef.current;
      const increment = delta > 100 ? 1 : delta / 1000 * 200;
      x += xIncrement * increment;
      y += yIncrement * increment;
      if(x >= finalX && deltaX > 0 || x <= finalX && deltaX < 0) {
        cardRef.current.style.position = 'static';
        isRebootingRef.current = false;
        if(onComplete) onComplete();
        return;
      }

      cardRef.current.style.left = `${x}px`;
      cardRef.current.style.top = `${y}px`;

      lastTimeRef.current = time;
      requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
  }

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
      if(!isAnimatingRef.current) return;
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
      if(!isAnimatingRef.current) return;

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
    if(isAnimatingRef.current || isRebootingRef.current || selected || collected) return;
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
    if(isAnimatingRef.current || isRebootingRef.current || selected || collected) return;
    //set the card's hovered value to false
    setCards((prev) => {
      const result = prev.map((item) => {return {...item}});
      result[id].hovered = false;
      return result;
    })
  }

  const getPosition = () => {
    //this function returns the values of x and y that define
    //the cards position on the screen. It is meant to be used for the
    //reboot animation

    //x_space is the value of the gap between each card horizontally in pixels
    //y_space is the value of the gap between each card vertically in pixels
    //xPosition is the cards position horizontally ex: 0 far left 3 far right
    //yPosition is the same as xPosition but vertically
    //card is the height value of the card
    const {card, container, padding, containerHeight} = size;
    const width = card * 3 / 4;
    const xPosition = id % 4;
    const yPosition = Math.floor(id / 4);
    const x_space = ((container - padding*2) - width*4) / 3;
    const x = padding + xPosition * width + xPosition * x_space;
    const y_space = ((containerHeight - padding*2) - card*2) / 4;
    const y = padding + y_space + ((containerHeight - 2*padding) / 2) * yPosition;
    console.log('x:', x);
    console.log('y:', y);

    return [x, y];

    /* if(!cardRef.current) return;
    cardRef.current.style.position = 'absolute';
    cardRef.current.style.top = `${y}px`;
    cardRef.current.style.left = `${x}px`; */
    
  }

  const handlePointerDown = () => {
    if(isAnimatingRef.current || isRebootingRef.current) return;
    if(collected || selected) return;
    angleRef.current = selected ? 180 : 0;
    selectAnimation();
    //getPosition();
    //moveAnimation(0,0,200,200);
  }

  return(
    <div
    ref={cardRef}
    onPointerEnter={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
    onPointerDown={handlePointerDown}

    style={{
      scale: hovered && !collected ? '1.2' : '1',
      width: size.card * 3 / 4,
      height: size.card,
    }} className="card">
    
    <img ref={backRef} src={background} style={{display: (selected || collected) ? 'none' : 'block'}} className="card-background" />
    <img ref={frontRef} src={image} style={{display: !(selected || collected) ? 'none' : 'block'}} className="card-front" />
    <div style={{display: collected ? 'block' : 'none'}} className="collected-layer"></div>
    </div>
  )

}

export default Card;