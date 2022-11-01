import Display from '../../components/display';
import MarkerEditor from '../../components/marker-editor';
import PrescriptionListEditor from '../../components/prescription-list-editor';
import ProfilePanel from '../../components/profile-panel';

import './style.css';
interface IMainProps {
}

const Main: React.FunctionComponent<IMainProps> = (props) => {
  return (
    <div className='Main'>
        <ProfilePanel />
        <MarkerEditor />
        <PrescriptionListEditor />
        <Display width={1200} height={600} />
    </div>
  );
};

export default Main;
