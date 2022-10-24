import { useState } from 'react';
import Modal from '../modal';
import ProfileEditor from '../profile-editor';

import './style.css';

interface IProfilePanelProps {
}

const ProfilePanel: React.FunctionComponent<IProfilePanelProps> = (props) => {
  const [profileEditorModalOpen, setProfileEditorModalOpen] = useState(false);

  return (
    <div className="ProfilePanel">
        <h1>Profile Panel</h1>
        <Modal modalOpen={profileEditorModalOpen} setModalOpen={setProfileEditorModalOpen}>
          <ProfileEditor />
        </Modal>
        <button onClick={() => setProfileEditorModalOpen(true)}>Open Profile Editor</button>
    </div>
  );
};

export default ProfilePanel;
