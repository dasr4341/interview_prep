import { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_APP_BASE_URL,
  documents: ['src/**/*.ts'],
  generates: {
    './src/generated/': {
      preset: 'client',
      plugins: [],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
