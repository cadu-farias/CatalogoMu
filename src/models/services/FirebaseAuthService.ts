import { 
    createUserWithEmailAndPassword, 
    signOut, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    User as FirebaseUser, 
    onAuthStateChanged 
} from 'firebase/auth';
import { IAuthService } from './IAuthService';
import { User } from '../entities/User';
import { auth } from '@/firebaseInit';

export class FirebaseAuthService implements IAuthService {


    pegarId(): string | null {
        return auth.currentUser ? auth.currentUser.uid : null;
    }

    async criarUsuario(email: string, senha: string, nome: string): Promise<User | null> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const firebaseUser = userCredential.user;
            await signOut(auth);
            return this.mapFirebaseUserToUser(firebaseUser, nome);
        } catch (error) {
            return null;
        }
    }

    async entrarComEmailESenha(email: string, senha: string): Promise<User | null> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            const firebaseUser = userCredential.user;
            return this.mapFirebaseUserToUser(firebaseUser, '');
        } catch {
            return null;
        }
    }

    trocarSenha(email: string): void {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Password reset email sent!');
            })
            .catch((error) => {
                console.error('Error sending password reset email:', error.code, error.message);
            });
    }

    sair(): void {
        signOut(auth);
    }

    

    onAuthStateChanged(callback: (user: User | null) => void): void {
        onAuthStateChanged(auth, (firebaseUser) => {
          const user = firebaseUser ? this.mapFirebaseUserToUser(firebaseUser, 'Criando Itens') : null;
          callback(user);
        });
      }

    private mapFirebaseUserToUser(firebaseUser: FirebaseUser, nome: string): User {
        return new User(
            firebaseUser.uid,
            firebaseUser.email ?? '',
            nome
        );
    }
}
