import { Order, InstallmentPlan, GiveawayEntry, EmailLog, User, Investment, Vehicle } from '../types';
import { app, auth, db as firestoreDb } from './firebase';

// --- GETTERS (Asynchronous Firestore queries) ---

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
    const snapshot = await firestoreDb.collection('vehicles').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const snapshot = await firestoreDb.collection('orders').orderBy('order_date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const fetchInstallmentPlans = async (): Promise<InstallmentPlan[]> => {
    try {
        const snapshot = await firestoreDb.collection('installment_plans').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InstallmentPlan));
    } catch (error) {
        console.error("Error fetching installment plans:", error);
        return [];
    }
};

export const fetchGiveawayEntries = async (): Promise<GiveawayEntry[]> => {
    try {
        const snapshot = await firestoreDb.collection('giveaway_entries').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GiveawayEntry));
    } catch (error) {
        console.error("Error fetching giveaway entries:", error);
        return [];
    }
};


export const fetchEmailLogs = async (): Promise<EmailLog[]> => {
  try {
    const snapshot = await firestoreDb.collection('email_logs').orderBy('sent_at', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmailLog));
  } catch (error) {
    console.error("Error fetching email logs:", error);
    return [];
  }
};

export const getSalesOverTime = async () => {
    // This can be replaced with a real aggregation query in a production environment
    // For now, returning static data for demonstration.
    return [
        { name: 'Jan', sales: 450000 },
        { name: 'Feb', sales: 480000 },
        { name: 'Mar', sales: 620000 },
        { name: 'Apr', sales: 710000 },
        { name: 'May', sales: 850000 },
        { name: 'Jun', sales: 980000 },
    ];
};

export const getInvestmentsForUser = async (userId: string): Promise<Investment[]> => {
  try {
    const snapshot = await firestoreDb.collection('investments')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment));
  } catch (error) {
    console.error("Error fetching investments for user:", error);
    return [];
  }
};

export const getPendingOrderForUser = async (userId: string): Promise<Order | null> => {
  try {
    const snapshot = await firestoreDb.collection('orders')
      .where('userId', '==', userId)
      .where('payment_status', '==', 'Awaiting Receipt')
      .limit(1)
      .get();
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Order;
  } catch (error) {
    console.error("Error fetching pending order:", error);
    return null;
  }
};


// --- USER ACTIONS (Firebase Auth & Firestore) ---

export const getUser = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await firestoreDb.collection('users').doc(uid).get();
    if (userDoc.exists) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const signUpUser = async (name: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const firebaseUser = userCredential.user;
        if (firebaseUser) {
            // Create user profile in Firestore
            const newUser: Omit<User, 'id'> = {
                name,
                email,
                balance: 0,
            };
            await firestoreDb.collection('users').doc(firebaseUser.uid).set(newUser);
            return { success: true, user: { id: firebaseUser.uid, ...newUser } };
        }
        return { success: false, error: 'User could not be created.' };
    } catch (error: any) {
        console.error("Signup error:", error);
        return { success: false, error: error.message || 'An unexpected error occurred.' };
    }
};


export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const firebaseUser = userCredential.user;
    if (firebaseUser) {
      return await getUser(firebaseUser.uid);
    }
    return null;
  } catch (error) {
    console.error("Login error:", error);
    return null; // Or re-throw error to be handled in UI
  }
};

export const signInWithGoogle = async (): Promise<User | null> => {
    try {
        const provider = new (window as any).firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const firebaseUser = result.user;

        if (firebaseUser) {
            // Check if user already exists in Firestore
            const userDoc = await firestoreDb.collection('users').doc(firebaseUser.uid).get();
            if (!userDoc.exists) {
                // If new user, create a profile in Firestore
                const newUser: Omit<User, 'id'> = {
                    name: firebaseUser.displayName || 'Google User',
                    email: firebaseUser.email!,
                    balance: 0,
                };
                await firestoreDb.collection('users').doc(firebaseUser.uid).set(newUser);
                return { id: firebaseUser.uid, ...newUser };
            }
            // If user exists, return their data
            return { id: userDoc.id, ...userDoc.data() } as User;
        }
        return null;
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        throw error;
    }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
        await firestoreDb.collection('users').doc(userId).update(updates);
    } catch (error) {
        console.error("Error updating user:", error);
    }
};

// --- SETTERS / ACTIONS (Firestore writes) ---
export const addEmailLog = async (log: Omit<EmailLog, 'id' | 'sent_at'>): Promise<void> => {
    try {
        await firestoreDb.collection('email_logs').add({
            ...log,
            sent_at: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error adding email log:", error);
    }
};

export const addOrder = async (orderData: Omit<Order, 'id' | 'order_date'>): Promise<Order> => {
  try {
    const docRef = await firestoreDb.collection('orders').add({
      ...orderData,
      order_date: new Date().toISOString().split('T')[0],
    });
    return { ...orderData, id: docRef.id, order_date: new Date().toISOString().split('T')[0] };
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};

export const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<void> => {
  try {
    await firestoreDb.collection('orders').doc(orderId).update(updates);
  } catch (error) {
    console.error("Error updating order:", error);
  }
};

export const addInvestment = async (investmentData: Omit<Investment, 'id' | 'date'>): Promise<Investment> => {
    try {
        const docRef = await firestoreDb.collection('investments').add({
            ...investmentData,
            date: new Date().toISOString().split('T')[0],
        });
        return { ...investmentData, id: docRef.id, date: new Date().toISOString().split('T')[0] };
    } catch (error) {
        console.error("Error adding investment:", error);
        throw error;
    }
};

export const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    try {
        const docRef = await firestoreDb.collection('vehicles').add(vehicleData);
        return { ...vehicleData, id: docRef.id };
    } catch (error) {
        console.error("Error adding vehicle:", error);
        throw error;
    }
};

export const updateVehicle = async (vehicleData: Vehicle): Promise<void> => {
    try {
        const { id, ...data } = vehicleData;
        await firestoreDb.collection('vehicles').doc(id).update(data);
    } catch (error) {
        console.error("Error updating vehicle:", error);
    }
};

export const deleteVehicle = async (vehicleId: string): Promise<void> => {
    try {
        await firestoreDb.collection('vehicles').doc(vehicleId).delete();
    } catch (error) {
        console.error("Error deleting vehicle:", error);
    }
};
