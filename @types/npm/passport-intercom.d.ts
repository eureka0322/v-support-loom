declare module 'passport-intercom' {
  export const Strategy: any;

  import { Profile } from 'passport';
  export interface IntercomProfile extends Profile {
    _json: Record<string, any>;
  }
  // etc.
}
