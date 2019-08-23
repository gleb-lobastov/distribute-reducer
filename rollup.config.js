import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

const extensions = ['.js', '.ts'];

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
  },
  plugins: [
    babel({
      extensions,
      exclude: 'node_modules/**',
    }),
    commonjs({ extensions }),
  ],
};
