

import { Order, InstallmentPlan, GiveawayEntry, EmailLog, User, Investment, Vehicle, Deposit } from '../types';
import { app, auth, db as firestoreDb } from './firebase';
import * as mockData from './mockData';

// --- DEVELOPMENT FLAG ---
// Set this to `true` to use local mock data instead of connecting to Firestore.
// This is useful for development when the backend is not available or for demo purposes.
// The current app is failing because the Firestore database has not been created for this project.
// Using mock data will allow the application to run without backend errors.
const USE_MOCK_DATA = false;

// --- MOCK DATA STORE (for write operations) ---
let mockVehicles = [...mockData.mockVehicles];
let mockOrders = [...mockData.mockOrders];
let mockInstallmentPlans = [...mockData.mockInstallmentPlans];
let mockGiveawayEntries = [...mockData.mockGiveawayEntries];
let mockEmailLogs = [...mockData.mockEmailLogs];
let mockInvestments = [...mockData.mockInvestments];
let mockUsers = [...mockData.mockUsers];
let mockDeposits = [...mockData.mockDeposits];

// Helper for generating random IDs
const generateId = () => Math.random().toString(36).substring(2, 15);


// --- GETTERS (Asynchronous Firestore queries) ---

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for vehicles.");
    return Promise.resolve(mockVehicles);
  }
  try {
    const snapshot = await firestoreDb.collection('vehicles').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for orders.");
    return Promise.resolve(mockOrders);
  }
  try {
    const snapshot = await firestoreDb.collection('orders').orderBy('order_date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const fetchInstallmentPlans = async (): Promise<InstallmentPlan[]> => {
    if (USE_MOCK_DATA) {
        console.log("Using mock data for installment plans.");
        return Promise.resolve(mockInstallmentPlans);
    }
    try {
        const snapshot = await firestoreDb.collection('installment_plans').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InstallmentPlan));
    } catch (error) {
        console.error("Error fetching installment plans:", error);
        throw error;
    }
};

export const fetchGiveawayEntries = async (): Promise<GiveawayEntry[]> => {
    if (USE_MOCK_DATA) {
        console.log("Using mock data for giveaway entries.");
        return Promise.resolve(mockGiveawayEntries);
    }
    try {
        const snapshot = await firestoreDb.collection('giveaway_entries').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GiveawayEntry));
    } catch (error) {
        console.error("Error fetching giveaway entries:", error);
        throw error;
    }
};


export const fetchEmailLogs = async (): Promise<EmailLog[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for email logs.");
    return Promise.resolve(mockEmailLogs);
  }
  try {
    const snapshot = await firestoreDb.collection('email_logs').orderBy('sent_at', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmailLog));
  } catch (error) {
    console.error("Error fetching email logs:", error);
    throw error;
  }
};

export const fetchDeposits = async (): Promise<Deposit[]> => {
    if (USE_MOCK_DATA) {
        console.log("Using mock data for deposits.");
        return Promise.resolve(mockDeposits);
    }
    try {
        const snapshot = await firestoreDb.collection('deposits').orderBy('request_date', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deposit));
    } catch (error) {
        console.error("Error fetching deposits:", error);
        throw error;
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
  if (USE_MOCK_DATA) {
      console.log(`Using mock data for getInvestmentsForUser: ${userId}`);
      return Promise.resolve(mockInvestments.filter(inv => inv.userId === userId));
  }
  try {
    const snapshot = await firestoreDb.collection('investments')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment));
  } catch (error) {
    console.error("Error fetching investments for user:", error);
    throw error;
  }
};

export const getPendingOrderForUser = async (userId: string): Promise<Order | null> => {
    if (USE_MOCK_DATA) {
        console.log(`Using mock data for getPendingOrderForUser: ${userId}`);
        const order = mockOrders.find(o => o.userId === userId && o.payment_status === 'Awaiting Receipt');
        return Promise.resolve(order || null);
    }
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
    throw error;
  }
};

export const getPendingDepositForUser = async (userId: string): Promise<Deposit | null> => {
    if (USE_MOCK_DATA) {
        console.log(`Using mock data for getPendingDepositForUser: ${userId}`);
        const deposit = mockDeposits.find(d => d.userId === userId && d.status === 'Pending');
        return Promise.resolve(deposit || null);
    }
    try {
        const snapshot = await firestoreDb.collection('deposits')
            .where('userId', '==', userId)
            .where('status', '==', 'Pending')
            .limit(1)
            .get();
        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Deposit;
    } catch (error) {
        console.error("Error fetching pending deposit:", error);
        throw error;
    }
};


// --- USER ACTIONS (Firebase Auth & Firestore) ---

export const getUser = async (uid: string): Promise<User | null> => {
  if (USE_MOCK_DATA) {
    console.log(`Using mock data for getUser: ${uid}`);
    let user = mockUsers.find(u => u.id === uid);
     if (!user) {
        // If a Firebase user exists but is not in our mock array, create them.
        const firebaseUser = auth.currentUser;
        if (firebaseUser && firebaseUser.uid === uid) {
            user = {
                id: uid,
                name: firebaseUser.displayName || 'New Mock User',
                email: firebaseUser.email!,
                balance: 100000 // Give some starting mock balance
            };
            mockUsers.push(user);
        }
     }
    return Promise.resolve(user || null);
  }
  try {
    const userDoc = await firestoreDb.collection('users').doc(uid).get();
    if (userDoc.exists) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const signUpUser = async (name: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const firebaseUser = userCredential.user;
        if (firebaseUser) {
            const newUser: Omit<User, 'id'> = { name, email, balance: 0 };
            if (USE_MOCK_DATA) {
                const mockUser = { id: firebaseUser.uid, ...newUser };
                mockUsers.push(mockUser);
                return { success: true, user: mockUser };
            }
            // Create user profile in Firestore
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
            if (USE_MOCK_DATA) {
                let user = mockUsers.find(u => u.id === firebaseUser.uid);
                if (!user) {
                    user = {
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || 'Google User',
                        email: firebaseUser.email!,
                        balance: 100000,
                    };
                    mockUsers.push(user);
                }
                return Promise.resolve(user);
            }
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

export const ensureAdminUserExists = async (): Promise<void> => {
    const ADMIN_EMAIL = 'admin@waxibyd.com';
    const ADMIN_PASSWORD = 'password123';

    // This logic should only run when not using mock data, as it interacts with live Firebase Auth.
    if (USE_MOCK_DATA) {
        const adminExists = mockUsers.some(u => u.email.toLowerCase() === ADMIN_EMAIL);
        if (!adminExists) {
            console.log("Adding mock admin user.");
            mockUsers.push({
                id: 'admin-user-id-placeholder',
                name: 'Site Admin',
                email: ADMIN_EMAIL,
                balance: 999999,
            });
        }
        return;
    }

    try {
        const signInMethods = await auth.fetchSignInMethodsForEmail(ADMIN_EMAIL);

        if (signInMethods.length === 0) {
            console.log("Admin user not found in Firebase Auth. Creating...");
            const userCredential = await auth.createUserWithEmailAndPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
            const firebaseUser = userCredential.user;

            if (firebaseUser) {
                const newAdminUser: Omit<User, 'id'> = {
                    name: 'Site Admin',
                    email: ADMIN_EMAIL,
                    balance: 999999,
                };
                await firestoreDb.collection('users').doc(firebaseUser.uid).set(newAdminUser);
                console.log("Admin user and Firestore profile created successfully.");
            }
        } else {
            console.log("Admin user already exists in Firebase Auth.");
        }
    } catch (error) {
        console.error("Error during admin user check/creation:", error);
    }
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
    if (USE_MOCK_DATA) {
        console.log(`Updating mock user: ${userId}`, updates);
        mockUsers = mockUsers.map(u => u.id === userId ? { ...u, ...updates } : u);
        return Promise.resolve();
    }
    try {
        await firestoreDb.collection('users').doc(userId).update(updates);
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

// --- SETTERS / ACTIONS (Firestore writes) ---
export const addEmailLog = async (log: Omit<EmailLog, 'id' | 'sent_at'>): Promise<void> => {
    if (USE_MOCK_DATA) {
        console.log("Adding mock email log.");
        const newLog: EmailLog = {
            ...log,
            id: generateId(),
            sent_at: new Date().toISOString()
        };
        mockEmailLogs.unshift(newLog);
        return Promise.resolve();
    }
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
  if (USE_MOCK_DATA) {
    console.log("Adding mock order.");
    const newOrder: Order = {
        ...orderData,
        id: generateId(),
        order_date: new Date().toISOString().split('T')[0]
    };
    mockOrders.unshift(newOrder);
    return Promise.resolve(newOrder);
  }
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
  if (USE_MOCK_DATA) {
    console.log(`Updating mock order: ${orderId}`, updates);
    mockOrders = mockOrders.map(o => o.id === orderId ? { ...o, ...updates } : o);
    return Promise.resolve();
  }
  try {
    await firestoreDb.collection('orders').doc(orderId).update(updates);
  } catch (error) {
    console.error("Error updating order:", error);
  }
};

export const addInvestment = async (investmentData: Omit<Investment, 'id' | 'date'>): Promise<Investment> => {
    if (USE_MOCK_DATA) {
        console.log("Adding mock investment.");
        const newInvestment: Investment = {
            ...investmentData,
            id: generateId(),
            date: new Date().toISOString().split('T')[0]
        };
        mockInvestments.unshift(newInvestment);
        return Promise.resolve(newInvestment);
    }
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

export const addDeposit = async (depositData: Omit<Deposit, 'id' | 'request_date'>): Promise<Deposit> => {
    if (USE_MOCK_DATA) {
        console.log("Adding mock deposit.");
        const newDeposit: Deposit = {
            ...depositData,
            id: generateId(),
            request_date: new Date().toISOString().split('T')[0]
        };
        mockDeposits.unshift(newDeposit);
        return Promise.resolve(newDeposit);
    }
    try {
        const docRef = await firestoreDb.collection('deposits').add({
            ...depositData,
            request_date: new Date().toISOString().split('T')[0],
        });
        return { ...depositData, id: docRef.id, request_date: new Date().toISOString().split('T')[0] };
    } catch (error) {
        console.error("Error adding deposit:", error);
        throw error;
    }
};

export const updateDeposit = async (depositId: string, updates: Partial<Deposit>): Promise<void> => {
    if (USE_MOCK_DATA) {
        console.log(`Updating mock deposit: ${depositId}`, updates);
        mockDeposits = mockDeposits.map(d => d.id === depositId ? { ...d, ...updates } : d);
        return Promise.resolve();
    }
    try {
        await firestoreDb.collection('deposits').doc(depositId).update(updates);
    } catch (error) {
        console.error("Error updating deposit:", error);
        throw error;
    }
};

export const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    if (USE_MOCK_DATA) {
        console.log("Adding mock vehicle.");
        const newVehicle: Vehicle = {
            ...vehicleData,
            id: generateId()
        };
        mockVehicles.unshift(newVehicle);
        return Promise.resolve(newVehicle);
    }
    try {
        const docRef = await firestoreDb.collection('vehicles').add(vehicleData);
        return { ...vehicleData, id: docRef.id };
    } catch (error) {
        console.error("Error adding vehicle:", error);
        throw error;
    }
};

export const updateVehicle = async (vehicleData: Vehicle): Promise<void> => {
    if (USE_MOCK_DATA) {
        console.log(`Updating mock vehicle: ${vehicleData.id}`);
        mockVehicles = mockVehicles.map(v => v.id === vehicleData.id ? vehicleData : v);
        return Promise.resolve();
    }
    try {
        const { id, ...data } = vehicleData;
        await firestoreDb.collection('vehicles').doc(id).update(data);
    } catch (error) {
        console.error("Error updating vehicle:", error);
    }
};

export const deleteVehicle = async (vehicleId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
        console.log(`Deleting mock vehicle: ${vehicleId}`);
        mockVehicles = mockVehicles.filter(v => v.id !== vehicleId);
        return Promise.resolve();
    }
    try {
        await firestoreDb.collection('vehicles').doc(vehicleId).delete();
    } catch (error) {
        console.error("Error deleting vehicle:", error);
    }
};