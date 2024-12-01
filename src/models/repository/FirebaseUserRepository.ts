import { IUserRepository } from "./interfaces/IUserRepository";
import { db } from "@/firebaseInit";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore"; 
import { User } from "../entities/User";

export class FirebaseUserRepository implements IUserRepository{
    async getUser(id: string): Promise<User | null> {
        const userRef = doc(db, "User", id);
        const user = await getDoc(userRef);
        if (user.exists()) {
            return new User(id, user.data().email, user.data().nome)
          } else {
            // docSnap.data() will be undefined in this case
            return null
          }
    }

    async gravarUsuario(id: string, nome: string | undefined, email:string): Promise<void> {
        await setDoc(doc(db, "User", id), {
            nome: nome,
            email: email
          });
    }
    async alterarNome(id: string, novoNome: string): Promise<void> {
        const userRef = doc(db, "User", id);
        await updateDoc(userRef, {
            nome: novoNome
          });
    }

}