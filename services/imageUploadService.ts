import { storage } from './firebase';

export const uploadImage = async (imageFile: File): Promise<string> => {
    try {
        const timestamp = Date.now();
        const safeName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const path = `admin_uploads/${timestamp}_${safeName}`;
        const ref = storage.ref().child(path);
        const snapshot = await ref.put(imageFile as any);
        // Get download URL
        const downloadUrl = await snapshot.ref.getDownloadURL();
        return downloadUrl;
    } catch (error) {
        console.error('Firebase Storage upload failed:', error);
        // Fallback to local object URL so admin can preview before retrying
        try {
            return URL.createObjectURL(imageFile);
        } catch (err) {
            throw error;
        }
    }
};