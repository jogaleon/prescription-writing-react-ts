import { useContext, useState } from "react";
import ProfileContext, { ProfileContextType } from "../../../../context/profile-context/ProfileContext";
import useDebounce from "../../../../hooks/useDebounce";

interface IEditProfileProps {
    profileId?: string
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const EditProfile: React.FunctionComponent<IEditProfileProps> = ({profileId, setModalOpen}) => {
    const {profilesState, profilesDispatch} = useContext(ProfileContext) as ProfileContextType
    const [input, setInput] = useState({
        name: '',
        printWidth: 0,
        printHeight: 0
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(prevInput => {
            return {
                ...prevInput,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleButtonClick = () => {
        profilesDispatch({type: 'CREATE_NEW_PROFILE'})
        setModalOpen(false)
    }
  
    return (
    <div className="EditProfile">
        <h1>{(profileId) ? `Edit Profile` : `Create New Profile`}</h1>
        <label htmlFor="name">Name: </label>
        <input type="text" name="name" value={input.name} onChange={handleInputChange} /><br />
        <p>Print Size</p>
        <label htmlFor="printWidth">Width: </label>
        <input type="number" name="printWidth" value={input.printWidth} onChange={handleInputChange} /><br />
        <label htmlFor="printHeight">Height: </label>
        <input type="number" name="printHeight" value={input.printHeight} onChange={handleInputChange} /><br />
        <button onClick={handleButtonClick}>Create New Profile</button>
    </div>
    );
};

export default EditProfile;
