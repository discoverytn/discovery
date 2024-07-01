
// import React, {useEffect, useRef} from 'react';
// import socketIOClient from 'socket.io-client';
// import {ANDROID, IOS} from '../constants/constants';
// import {isIOS} from '../helper';

// const SOCKET_DEV = 'https://socket-dev.com';

// export const SocketContext = React.createContext({socket: null});

// /**
//  * connectionConfig
//  */
// const connectionConfig = {
//   jsonp: false,
//   reconnection: true,
//   reconnectionDelay: 100,
//   reconnectionAttempts: 100000,
//   transports: ['websocket'],

// //optional
//   query: {
//     source: 'auction:mobile',
//     platform: isIOS() ? IOS : ANDROID,
//   },

// };

// /**
//  * SocketProvider
//  * @param {*} param0
//  * @returns
//  */
// export const SocketProvider = ({children}) => {
//   const env = SOCKET_DEV;
//   const socket = useRef(socketIOClient(env, connectionConfig));

//   useEffect(() => {
//     socket.current.on('connect', () => {});

//     socket.current.on('disconnect', msg => {
//       console.log('SocketIO: Disconnect', msg);
//       socket.current = socketIOClient(env, connectionConfig);
//     });

//     return () => {
//       if (socket && socket.current) {
//         socket?.current?.removeAllListeners();
//         socket?.current?.close();
//       }
//     };
//   }, [env]);

//   return (
//     <SocketContext.Provider value={{socket: socket.current}}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
import { io } from "socket.io-client"; 

const socket = io.connect("http://localhost:3000");
export default socket;