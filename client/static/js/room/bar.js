function decrement() {
    const decrementTick = (50 / gameData.moveTimer);
    let progress = 100;
    document.getElementById("bar").style.width = `${progress}%`

    let timeOutTick = () => {
        setTimeout(() => {
        if (progress > 0) {
            progress -= decrementTick;
            document.getElementById("bar").style.width = `${progress}%`
            timeOutTick();
        };
        }, 500);
    };
    
    timeOutTick();
};