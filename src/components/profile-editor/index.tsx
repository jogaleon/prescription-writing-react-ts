import { useContext, useState } from 'react';
import ProfileContext, { ProfileContextType } from '../../context/profile-context/ProfileContext';
import Modal from '../modal';
import EditProfile from './components/edit-profile';
import ProfileEditorItem from './components/profile-editor-item';
import './style.css';

interface IProfileEditorProps {
}

const ProfileEditor: React.FunctionComponent<IProfileEditorProps> = (props) => {
  const {profilesState, profilesDispatch, activeProfileId, setActiveProfileId} = useContext(ProfileContext) as ProfileContextType;
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  
  const profileElements = profilesState.map(profile => {
    return (
      <ProfileEditorItem 
        id={profile.id}
        name={profile.name}
        isActive={profile.id === activeProfileId}
        profilesDispatch={profilesDispatch}
        setActiveProfileId={setActiveProfileId}
      />
    )
  })

  return (
    <div className="ProfileEditor">
      <h1>Profile Editor</h1>

      <Modal modalOpen={editProfileModalOpen} setModalOpen={setEditProfileModalOpen}>
        <EditProfile />
      </Modal>

      <button onClick={() => profilesDispatch({type: 'CREATE_NEW_PROFILE'})}>Create new profile</button>
      <button onClick={() => setEditProfileModalOpen(true)}>Edit Profile</button>
      
      <div className='profile-editor-item-container'>
        {profileElements}
      </div>
    </div>
  );
};

export default ProfileEditor;
