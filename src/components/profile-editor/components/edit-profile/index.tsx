import { useState } from "react";

interface IEditProfileProps {
}

const EditProfile: React.FunctionComponent<IEditProfileProps> = (props) => {
    const [profileInput, setProfileInput] = useState({
        name: '',
        printWidth: 0,
        printHeight: 0
    })
    return (
    <div className="EditProfile">
        <h1>Edit Profile</h1>
        <h1>Edit Profile</h1>
        <h1>Edit Profile</h1>
    </div>
    );
};

export default EditProfile;
