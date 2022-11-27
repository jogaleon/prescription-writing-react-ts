const calculateScreenPPI = () => {
    const element = document.createElement('div');
    element.style.width = '1in';
    
    document.body.appendChild(element);
    const dpi = element.offsetWidth * window.devicePixelRatio;
    document.body.removeChild(element);

    return dpi
}

export default calculateScreenPPI;