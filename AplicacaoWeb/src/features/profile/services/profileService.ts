export const profileService = {
    updateBanner: async (file: File) => {
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
    },

    updateAvatar: async (file: File) => {
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
    },

    updateName: async (newName: string) => {
        return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
    },
};
