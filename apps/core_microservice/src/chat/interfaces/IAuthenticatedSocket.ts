import { Socket } from 'socket.io';
import { ICurrentUser } from '../../auth/interfaces/ICurrentUser';

export interface IAuthenticatedSocket extends Socket {
  data: {
    user?: ICurrentUser;
    isSystem?: boolean;
  };
  handshake: Socket['handshake'] & {
    auth: {
      token?: string;
    };
    headers: Record<string, string | string[] | undefined>;
  };
}
