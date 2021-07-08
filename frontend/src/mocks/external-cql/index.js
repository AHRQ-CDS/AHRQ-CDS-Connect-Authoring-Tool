import fs from 'fs';
import path from 'path';

export { default as mockExternalCqlLibrary } from './mockExternalCqlLibrary.json';
export { default as mockExternalCqlLibraryDependency } from './mockExternalCqlLibraryDependency.json';
export { default as mockStu3ExternalCqlLibrary } from './mockStu3ExternalCqlLibrary.json';

export const FHIRHelpers = fs.readFileSync(path.resolve(__dirname, './FHIRHelpers.cql'), 'utf-8');
export const mockStu3 = fs.readFileSync(path.resolve(__dirname, './mockStu3.cql'), 'utf-8');
export const mockR4 = fs.readFileSync(path.resolve(__dirname, './mockR4.cql'), 'utf-8');
export const mockWithErrors = fs.readFileSync(path.resolve(__dirname, './mockWithErrors.cql'), 'utf-8');
