import client from "../HHTP/client";

export default class CategoryProvider {

    // client
    static async createCategory(body) {
        return await client.post("/api/admin/categories/", body);
    }
    static async getAllCategory() {
        return await client.get(`/api/admin/categories/`);
    }
    static async getAllCategoryWithLanguage(language = 'ru') {
        // Get all categories with specific language
        console.log(`Getting all categories with language: ${language}`);
        try {
            const response = await client.get(`/api/admin/categories/`, {
                headers: {
                    'Accept-Language': language
                }
            });
            console.log(`Success getting categories with ${language}, count:`, response?.data?.results?.length || response?.data?.length);
            return response;
        } catch (error) {
            console.error(`Error getting all categories with language ${language}:`, error);
            throw error;
        }
    }
    static async deleteCategory(id) {
        return await client.delete(`/api/admin/categories/${id}/`);
    }
    static async getOneCategory(id) {
        return await client.get(`/api/admin/categories/get/${id}`);
    }
    static async getOneCategoryWithLanguage(id, language = 'ru') {
        // Get category with specific language to extract name_uz or name_ru
        // For GET requests with custom headers, pass config as second parameter
        const url = `/api/admin/categories/get/${id}`;
        console.log(`Fetching category ${id} with language: ${language}`);
        console.log(`URL: ${url}`);
        try {
            const response = await client.get(url, {
                headers: {
                    'Accept-Language': language
                }
            });
            console.log(`Success fetching with language ${language}:`, response.data);
            return response;
        } catch (error) {
            console.error(`Error fetching category ${id} with language ${language}:`, error.response?.status, error.response?.data);
            throw error;
        }
    }
    static async updateCategory(id, body) {
        return await client.put(`/api/admin/categories/${id}/`, body);
    }


}
