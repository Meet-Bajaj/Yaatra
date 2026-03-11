import { mockUsers } from './mockData';

export const userService = {
    getUserById: async (id: string) => {
        return mockUsers.find(user => user._id === id);
    },
    getUserByPhone: async (phone: string) => {
        return mockUsers.find(user => user.phone === phone);
    },
    getAllUsers: async () => {
        return mockUsers;
    },
};
