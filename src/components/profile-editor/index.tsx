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
        key={profile.id} 
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
        <EditProfile setModalOpen={setEditProfileModalOpen}/>
      </Modal>

      <button onClick={() => setEditProfileModalOpen(true)}>Create new profile</button>
      
      <div className='profile-editor-item-container'>
        {profileElements}
      </div>
    </div>
  );
};

export default ProfileEditor;
