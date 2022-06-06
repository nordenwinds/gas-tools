import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const extensions = ['.ts', '.js'];

const preventTreeShakingPlugin = () => {
  return {
    name: 'no-treeshaking',
    resolveId(id, importer) {
      if (!importer) {
        // let's not treeshake entry points, as we're not exporting anything in Apps Script files
        return { id, moduleSideEffects: 'no-treeshake' };
      }
      return null;
    },
  };
};

export default {
  input: './src/app/main.ts',
  output: {
    file: 'dist/app.js',
    format: 'esm',
  },
  plugins: [
    preventTreeShakingPlugin(),
    typescript({ target: 'es2020' }),
    nodeResolve({
      extensions,
    }),
    babel({ extensions, babelHelpers: 'runtime' }),
    copy({
      targets: [{ src: 'src/appsscript.json', dest: 'dist' }],
    }),
  ],
};
