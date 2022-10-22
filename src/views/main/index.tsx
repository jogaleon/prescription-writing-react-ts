import { useRef } from 'react';
import Display from '../../components/display';
import useElementSize from '../../hooks/useElementSize';

interface IMainProps {
}

const Main: React.FunctionComponent<IMainProps> = (props) => {
  const [divRef, divSize, setDivSize] = useElementSize<HTMLDivElement>(50,50);
  return (
    <div className='Main'>
      {/* <div className="sample-div" ref={divRef}></div> */}
      Main
      <Display width={1200} height={600}/>
    </div>
  );
};

export default Main;
