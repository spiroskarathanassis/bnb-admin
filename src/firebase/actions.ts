// import {
//   Auth,
//   getAuth,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signOut,
//   UserCredential,
// } from 'firebase/auth';

// import { useMainStore } from '@/stores';

// import router from '../router';

// export const auth: Auth = getAuth();

export const signOutAuth = async (): Promise<void> => {
  console.log('Signed out');
};

// export const signOutAuth = async (): Promise<void> => {
//   try {
//     await signOut(auth);
//     // Sign-out successful.
//     // console.log("signed out");
//     router.push({ name: 'Login' });
//   } catch (error) {
//     // An error happened.
//     console.log(error);
//     router.push({ name: 'Calendar' });
//   }
// };

// export const signInWithGoogle = async (): Promise<void> => {
//   const mainStore = useMainStore();

//   try {
//     const provider = new GoogleAuthProvider();

//     provider.addScope('https://www.googleapis.com/auth/userinfo.email');
//     provider.setCustomParameters({
//       prompt: 'select_account',
//     });

//     const res: UserCredential = await signInWithPopup(auth, provider);
//     const credential = GoogleAuthProvider.credentialFromResult(res);
//     const token = credential?.accessToken;
//     // console.log('credential', token);
//     if (!token) return;

//     mainStore.SET_TOKEN(token);
//     mainStore.SET_AUTH(true);
//   } catch (error) {
//     // // Handle Errors here.
//     // const errorCode = error.code;
//     const errorMessage = (error as Error).message;
//     // // The email of the user's account used.
//     // const email = error.email;

//     throw new Error(errorMessage);
//   }
// };
