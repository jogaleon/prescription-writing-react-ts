import { Unit } from './../../components/profile-editor/components/edit-profile/utils/convertToUnit';

type PrintSettings<T extends string | number> = {
    preset: string;
    printWidth: T;
    printHeight: T;
    unit: Unit;
    orientation: "portrait" | "landscape";
}

export default PrintSettings