import Display from '../../components/display';
import MarkerEditor from '../../components/marker-editor';
import ProfilePanel from '../../components/profile-panel';

import './style.css';
interface IMainProps {
}

const Main: React.FunctionComponent<IMainProps> = (props) => {
  return (
    <div className='Main'>
      {/* <div className='main-left'>
      </div> */}
        <ProfilePanel />
        <MarkerEditor />
        <Display width={1200} height={600}/>
      {/* <div className='main-right'>
      </div> */}
    </div>
  );
};

export default Main;
