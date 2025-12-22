import { esbuildDecorators } from '@anatine/esbuild-decorators';
import dotenvLoad from 'dotenv-load';
import esbuild from 'esbuild';

dotenvLoad(process.env.NODE_ENV);

esbuild
  .build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'index.js',
    plugins: [
      esbuildDecorators({
        tsconfig: 'tsconfig.json',
        cwd: process.cwd(),
      }),
    ],
    define: {
      'process.env.MONGODB_URI': `'${process.env.MONGODB_URI}'`,
      'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
      'process.env.PORT': `9000`,
    },
  })
  .then((data) => console.log('SUCCESS', data))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
