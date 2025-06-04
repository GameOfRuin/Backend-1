// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logRoutes = (server: any) => {
  const globalHandlers = server._router.stack;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalHandlers.map((globalHandler: any) => {
    if (globalHandler.name === 'router') {
      const globalPath = split(globalHandler.regexp).filter(Boolean).join('/');

      const nestedHandlers = globalHandler.handle.stack;

      console.log(`== ${globalPath.toUpperCase()} ==`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nestedHandlers.map((nestedHandler: any) => {
        const { methods, path } = nestedHandler.route;

        const method = Object.keys(methods)[0].toUpperCase();

        const tabSize = 8;
        const spaces = tabSize - method.length;
        console.log(`${method}:${' '.repeat(spaces)}/${globalPath}${path}`);
      });
    }
  });

  console.log();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const split = (path: any) => {
  if (typeof path === 'string') {
    return path.split('/');
  }

  if (path.fast_slash) {
    return '';
  }

  const match = path
    .toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);

  return match ? match[1].replace(/\\(.)/g, '$1').split('/') : '<complex:' + path.toString() + '>';
};
