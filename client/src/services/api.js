
export const api = {
    uploadPolicy: async (file) => {
        const formData = new FormData();
        formData.append('document', file);

        const response = await fetch('/admin/upload-policy', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        return response.json();
    },

    askQuestion: async (question) => {
        const response = await fetch('/user/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get answer');
        }

        return response.json();
    }
};
