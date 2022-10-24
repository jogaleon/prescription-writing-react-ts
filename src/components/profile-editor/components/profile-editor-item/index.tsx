import { ProfileActionType } from '../../../../context/profile-context/ProfileContext';

import './style.css';

interface IProfileEditorItemProps {
  id: string
  name: string
  isActive: boolean
  profilesDispatch: React.Dispatch<ProfileActionType>
  setActiveProfileId: React.Dispatch<string>
}

const ProfileEditorItem: React.FunctionComponent<IProfileEditorItemProps> = ({id, name, isActive, profilesDispatch, setActiveProfileId}) => {
  return (
    <div className="ProfileEditorItem">
      <p className="profile-name">Profile</p>
      {!isActive && <button onClick={() => setActiveProfileId(id)}>Load</button>}
      <button onClick={() => profilesDispatch({type:'DELETE_PROFILE', payload: {id: id}})}>Delete</button>
    </div>
  );
};

export default ProfileEditorItem;
