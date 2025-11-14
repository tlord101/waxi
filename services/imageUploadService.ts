// IMPORTANT: You must replace this with your own ImgBB API key.
// You can get a free key at https://api.imgbb.com/
// FIX: Changed to `let` to allow the placeholder check below without a compile-time error.
let IMGBB_API_KEY = '6505fea8f075d916e86cfd1bcbabc126'; // Placeholder

export const uploadImage = async (imageFile: File): Promise<string> => {
    if (IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY_HERE') {
        const warning = "Image upload is disabled. Please add your ImgBB API key in services/imageUploadService.ts.";
        alert(warning);
        console.warn(warning);
        // Return a placeholder image URL to avoid breaking the app
        return `https://picsum.photos/seed/${imageFile.name}/1920/1080`;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result.success) {
            return result.data.url; // Use `url` which is the direct link to the image
        } else {
            throw new Error(result.error?.message || 'Failed to upload image to ImgBB.');
        }
    } catch (error) {
        console.error('ImgBB Upload Error:', error);
        throw error;
    }
};