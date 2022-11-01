import { useContext, useMemo, useState } from 'react';

import ProfileContext, { ProfileContextType } from '../../context/profile-context/ProfileContext';

import Modal from '../modal';
import ProfileEditor from '../profile-editor';
import EditProfile from '../profile-editor/components/edit-profile';
import SaveButton from './components/save-button';
import TextSettingsControls from './components/text-settings-controls';

import './style.css'

interface IProfilePanelProps {
}

const ProfilePanel: React.FunctionComponent<IProfilePanelProps> = (props) => {
  const {profilesState, profilesDispatch, activeProfileId} = useContext(ProfileContext) as ProfileContextType;
  const [profileEditorModalOpen, setProfileEditorModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  const activeProfile = useMemo(() => profilesState.find(profile => profile.id === activeProfileId),[profilesState, activeProfileId])

  return (
    <div className="ProfilePanel">
        <h1>Profile Panel</h1>
        <p>Currently loaded profile: {activeProfile ? activeProfile.name : 'none'}</p>
        <Modal modalOpen={profileEditorModalOpen} setModalOpen={setProfileEditorModalOpen}>
          <ProfileEditor />
        </Modal>

        <Modal modalOpen={editProfileModalOpen} setModalOpen={setEditProfileModalOpen}>
          <EditProfile profileId={activeProfileId} setModalOpen={setEditProfileModalOpen} />
        </Modal>

        <button onClick={() => setProfileEditorModalOpen(true)}>Open Profile Editor</button>
        {activeProfile && 
          <>
            <button onClick={() => setEditProfileModalOpen(true)}>Edit Profile</button>
            <SaveButton />
            <TextSettingsControls />
          </>
        } 
    </div>
  );
};

export default ProfilePanel;
