const delaySync = (msDelay: number) => {
    const targetTime = Date.now() + msDelay;

    while (Date.now() < targetTime);
};

export default delaySync;