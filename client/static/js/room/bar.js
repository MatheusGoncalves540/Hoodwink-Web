function decrementMoveTimer() {
    clearTimeout(localVariables.timeOutTick);
    
    const decrementTick = (50 / gameData.moveTimer);
    let progress = 100;
    document.getElementById("bar").style.width = `${progress}%`

    localVariables.set_timeOutTick = () => {
        localVariables.timeOutTick = setTimeout(() => {
        if (progress > 0) {
            progress -= decrementTick;
            document.getElementById("bar").style.width = `${progress}%`
            localVariables.set_timeOutTick();
        };
        }, 500);
    };
    
    localVariables.set_timeOutTick();
};