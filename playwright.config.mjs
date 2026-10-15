import { defineConfig } from '@playwright/test';
import { tmpdir } from 'node:os';
import path from 'node:path';
export default defineConfig({ testDir:'./test', testMatch:'demo.spec.mjs', workers:2, outputDir:path.join(tmpdir(),'oura-gallery-tests'), use:{ baseURL:'http://127.0.0.1:4175', screenshot:'only-on-failure' }, webServer:{ command:'python -m http.server 4175 --bind 127.0.0.1', url:'http://127.0.0.1:4175/demo/dist/', reuseExistingServer:!process.env.CI } });
