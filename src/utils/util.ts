function threaded(fn: (...args: any[]) => void) {
  return function wrapper(...args: any[]) {
    return new Promise<void>((resolve, reject) => {
      try {
        setTimeout(() => {
          fn(...args);
          resolve();
        }, 0); // Run asynchronously but immediately after the call stack clears
      } catch (error) {
        reject(error);
      }
    });
  };
}

export { threaded };
