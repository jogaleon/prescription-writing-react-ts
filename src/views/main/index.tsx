import Display from '../../components/display';
import MarkerEditor from '../../components/marker-editor';

import './style.css';
interface IMainProps {
}

const Main: React.FunctionComponent<IMainProps> = (props) => {
  return (
    <div className='Main'>
      <MarkerEditor />
      <Display width={1200} height={600}/>
    </div>
  );
};

export default Main;
