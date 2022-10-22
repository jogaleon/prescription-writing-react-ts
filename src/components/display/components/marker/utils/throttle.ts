export const throttle = (f: Function) => {
    let token: any = null,
      lastArgs: any = null;
    const invoke = () => {
      f(...lastArgs);
      token = null;
    };
    const result = (...args: any[]) => {
      lastArgs = args;
      if (!token) {
        token = requestAnimationFrame(invoke);
      }
    };
    result.cancel = () => token && cancelAnimationFrame(token);
    return result;
  };