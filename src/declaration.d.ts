import { Theme } from './styles';

declare module '*.png';
declare module '*.jpg';
declare module '*.css';
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
