
import {Platform, Dimensions} from 'react-native';
const { height, width } = Dimensions.get('window');
const designWidth = 375;
const designHeight = 812;
export const Scale = val => {
    return (width / designWidth)  * val;
}
export const verticalScale = val => {
    return (height / designHeight)  * val;
}
