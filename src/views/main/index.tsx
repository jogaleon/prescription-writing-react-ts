import * as React from 'react';
import Display from '../../components/display';

interface IMainProps {
}

const Main: React.FunctionComponent<IMainProps> = (props) => {
  return (
    <div className='Main'>
      Main
      <Display width={100} height={100}/>
    </div>
  );
};

export default Main;
