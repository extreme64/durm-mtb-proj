import PropTypes from 'prop-types';
import L from 'leaflet';
import './assets/css/trail-poi.css';

const defaultIconImg = require('./assets/icons/pin-s2-1.png')
let iconPaths
let loadDefaultImg = false

try {
     iconPaths = {
        pinS1t1: require('./assets/icons/pin-s2-1.png'),
        pinS1t2: require('./assets/icons/pin-s2-1.png'),
        pinS1t3: require('./assets/icons/pin-s2-1.png'),
    };
} catch (error) {
    loadDefaultImg = true
    console.error(`Failed to load image file. Check path/name.`, error);
}

const CustomIcon = ({ iconType, iconSize, opacity }) => {
    let iconUrl = '';
    try {
        iconUrl = (!loadDefaultImg) ? iconPaths[iconType] : defaultIconImg;
    } catch (error) {
        console.error(`Failed to load icon for type '${iconType}'.`, error); 
    }

    const className = 'leaflet-div-icon--custom';

    const iconOptions = {
        iconUrl,
        iconSize: iconSize || [64, 64],
        className,
        opacity: opacity || 1,
        iconRetinaUrl: iconType[iconType],
    };

    return new L.Icon(iconOptions);
};

CustomIcon.propTypes = {
    iconType: PropTypes.oneOf(['pinS1t1', 'pinS1t2', 'pinS1t3']).isRequired,
    iconSize: PropTypes.arrayOf(PropTypes.number),
    opacity: PropTypes.number,
};

export default CustomIcon;