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
        <Display />
    </div>
  );
};

export default Main;
