import AsyncStorage from "@react-native-async-storage/async-storage";

const storageService = {
    save: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Erro ao salvar no armazenamento:", error);
        }
    },
    get: async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return JSON.parse(value);
        } catch (error) {
            console.error("Erro ao obter do armazenamento:", error);
            return null;
        }
    }
};

module.exports = storageService;
