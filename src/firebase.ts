import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// ... other firebase imports

export const firebaseApp: FirebaseApp = initializeApp({
  apiKey: "AIzaSyALe05T98elfda3RTNPa7aBxYvYC5sv7II",
  authDomain: "manda-vim-drinks.firebaseapp.com",
  projectId: "manda-vim-drinks",
  storageBucket: "manda-vim-drinks.appspot.com",
  messagingSenderId: "749155101643",
  appId: "1:749155101643:web:320317eeb24b928affe44e",
});

// used for the firestore refs
export const db = getFirestore(firebaseApp);

// here we can export reusable database references
export const usuariosRef = collection(db, "usuarios");
export const bebidasRef = collection(db, "bebidas");
export const registrosRef = collection(db, "registros");
